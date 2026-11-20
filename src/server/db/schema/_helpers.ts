import { customType, pgSchema, timestamp, uuid } from "drizzle-orm/pg-core";

// Supabase owns auth.users; we only reference it for foreign keys. drizzle-kit's
// default schemaFilter (["public"]) keeps this out of our generated migrations.
export const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

/** Case-insensitive text (Postgres citext extension, enabled in the first migration). */
export const citext = customType<{ data: string }>({ dataType: () => "citext" });

export const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
