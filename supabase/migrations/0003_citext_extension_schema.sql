-- Supabase's security advisor flags extensions installed in public. Move citext
-- to its own schema; Supabase includes "extensions" in search_path by default,
-- so unqualified "citext" type references keep working.
CREATE SCHEMA IF NOT EXISTS extensions;
--> statement-breakpoint
ALTER EXTENSION citext SET SCHEMA extensions;
