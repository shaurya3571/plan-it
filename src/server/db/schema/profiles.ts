import { sql } from "drizzle-orm";
import { check, date, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { authUsers, citext, createdAt } from "./_helpers";

// Inserted by a trigger on auth.users (see the first migration).
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    handle: citext("handle").unique(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    minutesPerDay: integer("minutes_per_day").notNull().default(90),
    timezone: text("timezone").notNull().default("Asia/Kolkata"),
    streakCount: integer("streak_count").notNull().default(0),
    streakLastActiveOn: date("streak_last_active_on"),
    createdAt: createdAt(),
  },
  (t) => [check("profiles_minutes_per_day_range", sql`${t.minutesPerDay} between 30 and 240`)],
);
