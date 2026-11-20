import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { authUsers, createdAt } from "./_helpers";
import { courses } from "./courses";

/** One row per successful course build; the rolling-30-day quota query scans this. */
export const usageLedger = pgTable(
  "usage_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    kind: text("kind").notNull().default("course_build"),
    courseId: uuid("course_id").references(() => courses.id),
    videoSeconds: integer("video_seconds").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("usage_ledger_user_window").on(t.userId, t.createdAt.desc())],
);
