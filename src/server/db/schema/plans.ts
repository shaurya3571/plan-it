import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

/** Seeded from src/content/pricing.ts in Phase 5. */
export const plans = pgTable("plans", {
  code: text("code").primaryKey(), // 'free' | 'pro' | 'max'
  name: text("name").notNull(),
  monthlyCourseLimit: integer("monthly_course_limit").notNull(),
  monthlyHoursLimit: integer("monthly_hours_limit").notNull(),
  maxVideoHours: integer("max_video_hours").notNull(),
  buildPriority: integer("build_priority").notNull(),
  isLifetimeLimit: boolean("is_lifetime_limit").notNull().default(false), // true for free: 1 course ever
});
