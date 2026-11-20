import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { citext, createdAt } from "./_helpers";
import { profiles } from "./profiles";
import { videoSources } from "./sources";

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: citext("slug").notNull().unique(),
    sourceId: uuid("source_id")
      .notNull()
      .unique() // global dedupe: one course per source video/playlist
      .references(() => videoSources.id),
    title: text("title").notNull(),
    creator: text("creator"),
    totalMinutes: integer("total_minutes").notNull(),
    lessonCount: integer("lesson_count").notNull().default(0),
    visibility: text("visibility").notNull().default("public"), // 'public' | 'unlisted'
    createdBy: uuid("created_by").references(() => profiles.id),
    buildStatus: text("build_status").notNull().default("building"), // 'building' | 'ready' | 'failed'
    learnersCount: integer("learners_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("courses_visibility_learners").on(t.visibility, t.learnersCount.desc())],
);

export const courseModules = pgTable(
  "course_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    idx: integer("idx").notNull(),
    title: text("title").notNull(),
    sourceExternalId: text("source_external_id"), // one row per playlist video
  },
  (t) => [uniqueIndex("course_modules_course_idx").on(t.courseId, t.idx)],
);
