import { cache } from "react";
import { and, asc, eq } from "drizzle-orm";
import type { CourseDetail, Lesson } from "../content/courses";
import { packIntoDays } from "../lib/plan";
import { db } from "./db";
import {
  courses,
  lessonNoteBlocks,
  lessons,
  quizOptions,
  quizzes,
  videoSources,
} from "./db/schema";

/**
 * Returns the same CourseDetail shape the hand-written content used, so DayPlan
 * and the course page did not have to change when the data moved to Postgres.
 * The day split is computed per viewer from their own pace.
 */
export async function getCourseDetail(
  slug: string,
  minutesPerDay: number,
): Promise<CourseDetail | null> {
  const [course] = await db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      creator: courses.creator,
      totalMinutes: courses.totalMinutes,
      lessonCount: courses.lessonCount,
      learnersCount: courses.learnersCount,
      sourceKind: videoSources.kind,
      sourceExternalId: videoSources.externalId,
    })
    .from(courses)
    .innerJoin(videoSources, eq(videoSources.id, courses.sourceId))
    .where(and(eq(courses.slug, slug), eq(courses.buildStatus, "ready")));

  if (!course) return null;

  const rows = await db
    .select({
      n: lessons.n,
      title: lessons.title,
      summary: lessons.summary,
      minutes: lessons.minutes,
      videoExternalId: lessons.videoExternalId,
    })
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(asc(lessons.n));

  // a course whose build never produced lessons has nothing to show
  if (rows.length === 0) return null;

  const plan: Lesson[] = rows.map((row) => ({
    n: row.n,
    title: row.title,
    summary: row.summary ?? "",
    minutes: row.minutes,
  }));

  return {
    slug: course.slug,
    title: course.title,
    creator: course.creator ?? "",
    minutes: course.totalMinutes,
    lessonCount: course.lessonCount,
    learning: course.learnersCount,
    // a playlist's source id is the playlist, so the thumbnail comes from its first video
    youtubeId:
      course.sourceKind === "video" ? course.sourceExternalId : rows[0]!.videoExternalId,
    minutesPerDay,
    days: packIntoDays(plan, minutesPerDay).map((dayLessons) => ({ lessons: dayLessons })),
  };
}

/** Just the title, for generateMetadata, rather than fetching every lesson again. */
export async function getCourseTitle(slug: string) {
  const [course] = await db
    .select({ title: courses.title })
    .from(courses)
    .where(and(eq(courses.slug, slug), eq(courses.buildStatus, "ready")));
  return course?.title ?? null;
}

/** Cached so the page and its generateMetadata share one round trip. */
export const getLessonDetail = cache(async (slug: string, n: number) => {
  const [lesson] = await db
    .select({
      id: lessons.id,
      n: lessons.n,
      title: lessons.title,
      summary: lessons.summary,
      minutes: lessons.minutes,
      videoExternalId: lessons.videoExternalId,
      courseSlug: courses.slug,
      courseTitle: courses.title,
      lessonCount: courses.lessonCount,
    })
    .from(lessons)
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .where(and(eq(courses.slug, slug), eq(lessons.n, n)));

  if (!lesson) return null;

  const noteBlocks = await db
    .select({ heading: lessonNoteBlocks.heading, body: lessonNoteBlocks.body })
    .from(lessonNoteBlocks)
    .where(eq(lessonNoteBlocks.lessonId, lesson.id))
    .orderBy(asc(lessonNoteBlocks.idx));

  const [quiz] = await db
    .select({
      id: quizzes.id,
      question: quizzes.question,
      explanation: quizzes.explanation,
      replayAtSeconds: quizzes.replayAtSeconds,
    })
    .from(quizzes)
    .where(eq(quizzes.lessonId, lesson.id));

  const options = quiz
    ? await db
        .select({ text: quizOptions.text, isCorrect: quizOptions.isCorrect })
        .from(quizOptions)
        .where(eq(quizOptions.quizId, quiz.id))
        .orderBy(asc(quizOptions.idx))
    : [];

  return {
    ...lesson,
    noteBlocks,
    quiz: quiz && options.length > 0 ? { ...quiz, options } : null,
  };
});

/** The sidebar list on the lesson page: every lesson of the course, cheaply. */
export const getCourseLessonList = cache(async (slug: string) =>
  db
    .select({ n: lessons.n, title: lessons.title, minutes: lessons.minutes })
    .from(lessons)
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .where(eq(courses.slug, slug))
    .orderBy(asc(lessons.n)),
);
