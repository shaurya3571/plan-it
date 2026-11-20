import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema/index.ts",
  out: "./supabase/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://placeholder",
  },
});
