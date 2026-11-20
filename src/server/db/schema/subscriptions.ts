import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { authUsers, createdAt } from "./_helpers";
import { plans } from "./plans";

/** Phase 5. Provider-defined status values (Razorpay, etc.) are not enumerated here. */
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    planCode: text("plan_code")
      .notNull()
      .references(() => plans.code),
    status: text("status").notNull(),
    provider: text("provider"),
    providerSubscriptionId: text("provider_subscription_id"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("subscriptions_one_active_per_user")
      .on(t.userId)
      .where(sql`${t.status} = 'active'`),
  ],
);
