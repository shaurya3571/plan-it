import { boolean, integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { lessons } from "./lessons";

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .unique()
    .references(() => lessons.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  explanation: text("explanation"),
  replayAtSeconds: integer("replay_at_seconds"), // "Replay 3:12 that explains it"
});

export const quizOptions = pgTable(
  "quiz_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    idx: integer("idx").notNull(),
    text: text("text").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (t) => [uniqueIndex("quiz_options_quiz_idx").on(t.quizId, t.idx)],
);
