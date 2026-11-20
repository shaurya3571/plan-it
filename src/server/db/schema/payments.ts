import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { authUsers, createdAt } from "./_helpers";
import { subscriptions } from "./subscriptions";

/** Phase 5. */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  provider: text("provider").notNull(),
  providerPaymentId: text("provider_payment_id").notNull().unique(), // webhook idempotency
  amountMinor: integer("amount_minor").notNull(),
  currency: text("currency").notNull(), // ISO 4217, e.g. 'INR'
  status: text("status").notNull(),
  invoiceUrl: text("invoice_url"),
  rawEventId: text("raw_event_id"),
  createdAt: createdAt(),
});
