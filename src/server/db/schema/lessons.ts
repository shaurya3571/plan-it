import { integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { courseModules, courses } from "./courses";

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id").references(() => courseModules.id),
    n: integer("n").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    startSeconds: integer("start_seconds").notNull(),
    endSeconds: integer("end_seconds").notNull(),
    minutes: integer("minutes").notNull(),
    videoExternalId: text("video_external_id").notNull(),
    status: text("status").notNull().default("pending"), // 'pending' | 'ready' | 'failed'
  },
  // The unique index on (course_id, n) also serves the lookup; no separate index needed.
  (t) => [uniqueIndex("lessons_course_n").on(t.courseId, t.n)],
);

export const lessonNoteBlocks = pgTable(
  "lesson_note_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    idx: integer("idx").notNull(),
    heading: text("heading").notNull(),
    body: text("body").notNull(),
  },
  (t) => [uniqueIndex("lesson_note_blocks_lesson_idx").on(t.lessonId, t.idx)],
);
