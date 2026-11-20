import { and, eq } from "drizzle-orm";
import { NonRetriableError } from "inngest";
import { packIntoDays } from "../../lib/plan";
import { bumpStep, failJob, finishJob, finishStep, startStep } from "../builds/progress";
import { db } from "../db";
import {
  courseModules,
  courses,
  enrollmentLessons,
  enrollments,
  lessonNoteBlocks,
  lessons,
  placementOptions,
  placementQuestionLessons,
  placementQuestions,
  placementTests,
  quizOptions,
  quizzes,
  usageLedger,
  videoSources,
  buildJobs,
} from "../db/schema";
import { planLessons, writeNotes, writePlacementTest, writeQuiz } from "../providers/ai";
import { sourceMetaSchema, type Cue, type PlannedLesson } from "../providers/schemas";
import { fetchTranscript } from "../providers/transcript";
import { BUILD_REQUESTED, inngest, type BuildRequested } from "./client";

/**
 * Each unit of real work is its own step, so a retry replays the cheap ones from
 * cache and only re-runs what actually failed - the per-lesson AI calls are the
 * expensive part and must not be paid for twice.
 *
 * Every step that writes is written to be safe to run again: it clears what it
 * owns before inserting, because a step that fails halfway still gets retried.
 */
export const buildCourse = inngest.createFunction(
  {
    id: "build-course",
    triggers: [{ event: BUILD_REQUESTED }],
    retries: 2,
    concurrency: { limit: 3 },
    onFailure: async ({ event, error }) => {
      // the failure event wraps the original one that triggered the run
      const original = (event as { data?: { event?: { data?: { buildJobId?: unknown } } } }).data
        ?.event;
      const buildJobId = original?.data?.buildJobId;
      if (typeof buildJobId === "string" && buildJobId.length > 0) {
        await failJob(buildJobId, error.message || "build failed");
      }
    },
  },
  async ({ event, step }) => {
    const { buildJobId, minutesPerDay } = (event.data ?? {}) as BuildRequested;
    if (!buildJobId) throw new NonRetriableError("build.requested without a buildJobId");

    const context = await step.run("load", async () => {
      const [row] = await db
        .select({
          courseId: courses.id,
          courseSlug: courses.slug,
          courseTitle: courses.title,
          requestedBy: buildJobs.requestedBy,
          durationSeconds: videoSources.durationSeconds,
          rawMeta: videoSources.rawMeta,
        })
        .from(buildJobs)
        .innerJoin(videoSources, eq(videoSources.id, buildJobs.sourceId))
        .innerJoin(courses, eq(courses.id, buildJobs.courseId))
        .where(eq(buildJobs.id, buildJobId));

      if (!row) throw new NonRetriableError(`build job ${buildJobId} has no course or source`);
      return row;
    });

    // cached by the server action when it called the YouTube API, so the pipeline
    // never asks twice for metadata that cannot change
    const source = sourceMetaSchema.parse(context.rawMeta);
    const videoCount = source.videos.length;

    // 1. transcripts, one per video
    await step.run("transcript-start", () => startStep(buildJobId, 0, videoCount));
    const transcripts: Record<string, Cue[]> = {};
    for (const [i, video] of source.videos.entries()) {
      transcripts[video.externalId] = await step.run(
        `transcript-${video.externalId}`,
        async () => {
          const cues = await fetchTranscript(video.externalId);
          await bumpStep(buildJobId, 0, i + 1, videoCount);
          return cues;
        },
      );
    }
    await step.run("transcript-end", () => finishStep(buildJobId, 0, videoCount));

    // 2. split each video into lessons
    await step.run("plan-start", () => startStep(buildJobId, 1, videoCount));
    const planned: PlannedLesson[] = [];
    for (const [i, video] of source.videos.entries()) {
      const forVideo = await step.run(`plan-${video.externalId}`, async () => {
        const result = await planLessons({
          videoExternalId: video.externalId,
          videoTitle: video.title,
          durationSeconds: video.durationSeconds,
          cues: transcripts[video.externalId] ?? [],
        });
        await bumpStep(buildJobId, 1, i + 1, videoCount);
        return result;
      });
      planned.push(...forVideo);
    }

    const built = await step.run("insert-lessons", async () =>
      db.transaction(async (tx) => {
        // this step owns every lesson of the course, so clearing first makes a
        // retry after a partial insert produce the same result as a clean run
        await tx.delete(lessons).where(eq(lessons.courseId, context.courseId));
        await tx.delete(courseModules).where(eq(courseModules.courseId, context.courseId));

        const moduleByVideo = new Map<string, string>();
        if (source.kind === "playlist") {
          const modules = await tx
            .insert(courseModules)
            .values(
              source.videos.map((video, idx) => ({
                courseId: context.courseId,
                idx,
                title: video.title,
                sourceExternalId: video.externalId,
              })),
            )
            .returning({
              id: courseModules.id,
              sourceExternalId: courseModules.sourceExternalId,
            });
          for (const row of modules) {
            if (row.sourceExternalId) moduleByVideo.set(row.sourceExternalId, row.id);
          }
        }

        return tx
          .insert(lessons)
          .values(
            planned.map((lesson, i) => ({
              courseId: context.courseId,
              moduleId: moduleByVideo.get(lesson.videoExternalId) ?? null,
              n: i + 1,
              title: lesson.title,
              summary: lesson.summary,
              startSeconds: lesson.startSeconds,
              endSeconds: lesson.endSeconds,
              // a lesson under a minute still reads as a minute in the day plan
              minutes: Math.max(1, Math.round((lesson.endSeconds - lesson.startSeconds) / 60)),
              videoExternalId: lesson.videoExternalId,
            })),
          )
          .returning({
            id: lessons.id,
            n: lessons.n,
            title: lessons.title,
            summary: lessons.summary,
            startSeconds: lessons.startSeconds,
            endSeconds: lessons.endSeconds,
            minutes: lessons.minutes,
            videoExternalId: lessons.videoExternalId,
          });
      }),
    );
    await step.run("plan-end", () => finishStep(buildJobId, 1, videoCount));

    const cuesFor = (lesson: (typeof built)[number]) =>
      (transcripts[lesson.videoExternalId] ?? []).filter(
        (cue) => cue.atSeconds >= lesson.startSeconds && cue.atSeconds < lesson.endSeconds,
      );

    // 3. study notes, one step per lesson
    await step.run("notes-start", () => startStep(buildJobId, 2, built.length));
    for (const [i, lesson] of built.entries()) {
      await step.run(`notes-${lesson.n}`, async () => {
        const blocks = await writeNotes({
          lessonTitle: lesson.title,
          lessonSummary: lesson.summary ?? "",
          cues: cuesFor(lesson),
        });
        await db.transaction(async (tx) => {
          await tx.delete(lessonNoteBlocks).where(eq(lessonNoteBlocks.lessonId, lesson.id));
          await tx.insert(lessonNoteBlocks).values(
            blocks.map((block, idx) => ({
              lessonId: lesson.id,
              idx,
              heading: block.heading,
              body: block.body,
            })),
          );
        });
        await bumpStep(buildJobId, 2, i + 1, built.length);
      });
    }
    await step.run("notes-end", () => finishStep(buildJobId, 2, built.length));

    // 4. one quiz per lesson
    await step.run("quizzes-start", () => startStep(buildJobId, 3, built.length));
    for (const [i, lesson] of built.entries()) {
      await step.run(`quiz-${lesson.n}`, async () => {
        const quiz = await writeQuiz({
          lessonTitle: lesson.title,
          lessonSummary: lesson.summary ?? "",
          startSeconds: lesson.startSeconds,
          endSeconds: lesson.endSeconds,
          cues: cuesFor(lesson),
        });
        await db.transaction(async (tx) => {
          // quizzes.lesson_id is unique, so the old one goes before the new one
          await tx.delete(quizzes).where(eq(quizzes.lessonId, lesson.id));
          const [row] = await tx
            .insert(quizzes)
            .values({
              lessonId: lesson.id,
              question: quiz.question,
              explanation: quiz.explanation,
              replayAtSeconds: quiz.replayAtSeconds,
            })
            .returning({ id: quizzes.id });
          await tx.insert(quizOptions).values(
            quiz.options.map((option, idx) => ({
              quizId: row!.id,
              idx,
              text: option.text,
              isCorrect: option.isCorrect,
            })),
          );
        });
        await bumpStep(buildJobId, 3, i + 1, built.length);
      });
    }
    await step.run("quizzes-end", () => finishStep(buildJobId, 3, built.length));

    // 5. placement test for the whole course
    await step.run("placement-start", () => startStep(buildJobId, 4, 1));
    await step.run("placement", async () => {
      const questions = await writePlacementTest({
        courseTitle: context.courseTitle,
        lessons: built.map((lesson) => ({
          n: lesson.n,
          title: lesson.title,
          summary: lesson.summary ?? "",
        })),
      });
      const lessonIdByN = new Map(built.map((lesson) => [lesson.n, lesson.id]));

      await db.transaction(async (tx) => {
        await tx.delete(placementTests).where(eq(placementTests.courseId, context.courseId));
        const [test] = await tx
          .insert(placementTests)
          .values({ courseId: context.courseId })
          .returning({ id: placementTests.id });

        for (const [idx, question] of questions.entries()) {
          const [row] = await tx
            .insert(placementQuestions)
            .values({
              placementTestId: test!.id,
              idx,
              question: question.question,
              explanation: question.explanation,
            })
            .returning({ id: placementQuestions.id });

          await tx.insert(placementOptions).values(
            question.options.map((option, optionIdx) => ({
              placementQuestionId: row!.id,
              idx: optionIdx,
              text: option.text,
              isCorrect: option.isCorrect,
            })),
          );

          // the model can repeat a lesson number, and the join table's primary key would reject it
          const covered = [...new Set(question.lessonNs)]
            .map((n) => lessonIdByN.get(n))
            .filter((id): id is string => Boolean(id));
          if (covered.length > 0) {
            await tx.insert(placementQuestionLessons).values(
              covered.map((lessonId) => ({ placementQuestionId: row!.id, lessonId })),
            );
          }
        }
      });
      await bumpStep(buildJobId, 4, 1, 1);
    });
    await step.run("placement-end", () => finishStep(buildJobId, 4, 1));

    // 6. publish, and give the builder the enrollment that holds their day plan
    await step.run("days-start", () => startStep(buildJobId, 5, 1));
    const days = await step.run("finalize", async () => {
      const totalMinutes = built.reduce((total, lesson) => total + lesson.minutes, 0);
      const packed = packIntoDays(built, minutesPerDay);

      await db.transaction(async (tx) => {
        await tx
          .update(lessons)
          .set({ status: "ready" })
          .where(eq(lessons.courseId, context.courseId));
        await tx
          .update(courses)
          .set({
            lessonCount: built.length,
            totalMinutes,
            buildStatus: "ready",
            publishedAt: new Date(),
          })
          .where(eq(courses.id, context.courseId));

        const [enrollment] = await tx
          .insert(enrollments)
          .values({
            userId: context.requestedBy,
            courseId: context.courseId,
            minutesPerDay,
            origin: "built",
          })
          .onConflictDoUpdate({
            target: [enrollments.userId, enrollments.courseId],
            set: { minutesPerDay },
          })
          .returning({ id: enrollments.id });

        await tx
          .delete(enrollmentLessons)
          .where(eq(enrollmentLessons.enrollmentId, enrollment!.id));
        await tx.insert(enrollmentLessons).values(
          packed.flatMap((dayLessons, dayIndex) =>
            dayLessons.map((lesson) => ({
              enrollmentId: enrollment!.id,
              lessonId: lesson.id,
              dayIndex,
            })),
          ),
        );

        // one row per successful build, so clear any left by a half-finished attempt
        await tx
          .delete(usageLedger)
          .where(
            and(
              eq(usageLedger.userId, context.requestedBy),
              eq(usageLedger.courseId, context.courseId),
            ),
          );
        await tx.insert(usageLedger).values({
          userId: context.requestedBy,
          courseId: context.courseId,
          videoSeconds: source.durationSeconds,
        });
      });

      return packed.length;
    });
    await step.run("days-end", () => finishStep(buildJobId, 5, 1));
    await step.run("finish", () => finishJob(buildJobId));

    return { slug: context.courseSlug, lessons: built.length, days };
  },
);
