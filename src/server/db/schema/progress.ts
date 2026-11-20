import { boolean, index, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { enrollments } from "./enrollments";
import { placementOptions, placementQuestions } from "./placement";
import { quizOptions, quizzes } from "./quizzes";

export const placementAttempts = pgTable("placement_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  enrollmentId: uuid("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const placementAnswers = pgTable("placement_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => placementAttempts.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => placementQuestions.id),
  optionId: uuid("option_id")
    .notNull()
    .references(() => placementOptions.id),
  isCorrect: boolean("is_correct").notNull(),
});

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    optionId: uuid("option_id")
      .notNull()
      .references(() => quizOptions.id),
    isCorrect: boolean("is_correct").notNull(),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("quiz_attempts_enrollment_quiz").on(t.enrollmentId, t.quizId)],
);
