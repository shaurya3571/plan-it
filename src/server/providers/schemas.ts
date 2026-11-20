import { z } from "zod";

/**
 * Both the mock and the live path are parsed through these, so a provider can
 * never hand the pipeline a shape the database will reject. Model output is
 * untrusted input like any other.
 */

const seconds = z.number().int().nonnegative().finite();

export const sourceMetaSchema = z.object({
  externalId: z.string().min(1),
  kind: z.enum(["video", "playlist"]),
  title: z.string().min(1),
  channelTitle: z.string().min(1).nullable(),
  durationSeconds: z.number().int().positive().finite(),
  itemCount: z.number().int().positive().finite().nullable(),
  chapterCount: z.number().int().nonnegative().finite(),
  videos: z
    .array(
      z.object({
        externalId: z.string().min(1),
        title: z.string().min(1),
        durationSeconds: z.number().int().positive().finite(),
      }),
    )
    .min(1),
});

export const transcriptSchema = z.array(
  z.object({ atSeconds: seconds, text: z.string().min(1) }),
);

/** `n` is assigned by the pipeline, not the model - one less thing to trust. */
export const plannedLessonsSchema = z
  .array(
    z.object({
      title: z.string().min(1).max(200),
      summary: z.string().min(1).max(600),
      startSeconds: seconds,
      endSeconds: seconds,
      videoExternalId: z.string().min(1),
    }),
  )
  .min(1)
  .refine((ls) => ls.every((l) => l.endSeconds > l.startSeconds), {
    message: "lesson must end after it starts",
  });

export const noteBlocksSchema = z
  .array(z.object({ heading: z.string().min(1).max(200), body: z.string().min(1) }))
  .min(1);

const options = z
  .array(z.object({ text: z.string().min(1), isCorrect: z.boolean() }))
  .min(2)
  .refine((o) => o.filter((x) => x.isCorrect).length === 1, {
    message: "a question needs exactly one correct option",
  });

export const quizSchema = z.object({
  question: z.string().min(1),
  explanation: z.string().min(1),
  replayAtSeconds: seconds.nullable(),
  options,
});

export const placementTestSchema = z
  .array(
    z.object({
      question: z.string().min(1),
      explanation: z.string().min(1),
      /** which lesson numbers this question lets a learner skip */
      lessonNs: z.array(z.number().int().positive()).min(1),
      options,
    }),
  )
  .min(1);

export type SourceMeta = z.infer<typeof sourceMetaSchema>;
export type Cue = z.infer<typeof transcriptSchema>[number];
export type PlannedLesson = z.infer<typeof plannedLessonsSchema>[number];
export type NoteBlock = z.infer<typeof noteBlocksSchema>[number];
export type Quiz = z.infer<typeof quizSchema>;
export type PlacementQuestion = z.infer<typeof placementTestSchema>[number];
