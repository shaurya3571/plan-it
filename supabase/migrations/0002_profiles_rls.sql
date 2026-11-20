-- Defence-in-depth only: server code uses the service-role key and bypasses RLS,
-- enforcing authorisation itself via requireUser() (see src/server/auth/guards.ts).
-- This matters if a client component ever reads/writes profiles with the user's
-- own session. Later phases add RLS to their own tables as each feature lands.
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "profiles_select_own" ON "profiles" FOR SELECT USING (auth.uid() = "id");
--> statement-breakpoint
CREATE POLICY "profiles_update_own" ON "profiles" FOR UPDATE USING (auth.uid() = "id");
