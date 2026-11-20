import { boolean, integer, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses";
import { lessons } from "./lessons";

export const placementTests = pgTable("placement_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .unique()
    .references(() => courses.id, { onDelete: "cascade" }),
});

export const placementQuestions = pgTable("placement_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  placementTestId: uuid("placement_test_id")
    .notNull()
    .references(() => placementTests.id, { onDelete: "cascade" }),
  idx: integer("idx").notNull(),
  question: text("question").notNull(),
  explanation: text("explanation"),
});

/** Which lessons a placement question clears if answered correctly. */
export const placementQuestionLessons = pgTable(
  "placement_q_lessons",
  {
    placementQuestionId: uuid("placement_question_id")
      .notNull()
      .references(() => placementQuestions.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.placementQuestionId, t.lessonId] })],
);

export const placementOptions = pgTable("placement_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  placementQuestionId: uuid("placement_question_id")
    .notNull()
    .references(() => placementQuestions.id, { onDelete: "cascade" }),
  idx: integer("idx").notNull(),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
});
