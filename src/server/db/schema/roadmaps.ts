import { integer, pgTable, primaryKey, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { authUsers, citext } from "./_helpers";
import { courses } from "./courses";

export const roadmaps = pgTable("roadmaps", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: citext("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  createdBy: uuid("created_by").references(() => authUsers.id),
  visibility: text("visibility").notNull().default("public"),
  learnersCount: integer("learners_count").notNull().default(0),
});

export const roadmapStages = pgTable(
  "roadmap_stages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roadmapId: uuid("roadmap_id")
      .notNull()
      .references(() => roadmaps.id, { onDelete: "cascade" }),
    idx: integer("idx").notNull(),
    title: text("title").notNull(),
  },
  (t) => [uniqueIndex("roadmap_stages_roadmap_idx").on(t.roadmapId, t.idx)],
);

export const roadmapStageCourses = pgTable(
  "roadmap_stage_courses",
  {
    roadmapStageId: uuid("roadmap_stage_id")
      .notNull()
      .references(() => roadmapStages.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    idx: integer("idx").notNull(),
  },
  (t) => [primaryKey({ columns: [t.roadmapStageId, t.courseId] })],
);

export const roadmapEnrollments = pgTable(
  "roadmap_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    roadmapId: uuid("roadmap_id")
      .notNull()
      .references(() => roadmaps.id, { onDelete: "cascade" }),
    currentStageIdx: integer("current_stage_idx").notNull().default(0),
  },
  (t) => [uniqueIndex("roadmap_enrollments_user_roadmap").on(t.userId, t.roadmapId)],
);
