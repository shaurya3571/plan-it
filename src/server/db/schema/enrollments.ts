import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "./_helpers";
import { courses } from "./courses";
import { lessons } from "./lessons";

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    minutesPerDay: integer("minutes_per_day").notNull(), // snapshot at enrol time
    origin: text("origin").notNull(), // 'built' | 'joined'
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("enrollments_user_course").on(t.userId, t.courseId)],
);

/** Per-user day packing over a course's lessons. */
export const enrollmentLessons = pgTable(
  "enrollment_lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    dayIndex: integer("day_index").notNull(),
    status: text("status").notNull().default("planned"), // 'planned' | 'skipped_by_placement' | 'completed'
    completedAt: timestamp("completed_at", { withTimezone: true }),
    watchSeconds: integer("watch_seconds").notNull().default(0),
  },
  (t) => [
    uniqueIndex("enrollment_lessons_enrollment_lesson").on(t.enrollmentId, t.lessonId),
    index("enrollment_lessons_day_order").on(t.enrollmentId, t.dayIndex, t.lessonId),
  ],
);
