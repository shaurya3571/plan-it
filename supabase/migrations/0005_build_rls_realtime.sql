-- Phase 2. Two jobs here.
--
-- 1. Reproduce the posture that was applied straight to the project while fixing
--    Phase 1's security advisor findings but never written down: RLS on every table,
--    and no DML grants for the PostgREST roles. Without this a fresh environment
--    built from these migrations is wide open where the live project is not.
--    Every statement is idempotent, so applying it to the live project is a no-op.
--
-- 2. Open the single hole Phase 2 needs: /build/[slug] subscribes to its own build
--    over Realtime with the user's own session, so `authenticated` needs SELECT plus
--    an owner-scoped policy on exactly those two tables. Everything else stays
--    server-only through DATABASE_URL, which connects as the table owner and so
--    bypasses RLS entirely.
do $$
declare
  t text;
begin
  foreach t in array array[
    'bookmarks', 'build_jobs', 'build_steps', 'course_modules', 'courses',
    'enrollment_lessons', 'enrollments', 'lesson_note_blocks', 'lessons', 'payments',
    'placement_answers', 'placement_attempts', 'placement_options', 'placement_q_lessons',
    'placement_questions', 'placement_tests', 'plans', 'provider_calls', 'quiz_attempts',
    'quiz_options', 'quizzes', 'roadmap_enrollments', 'roadmap_stage_courses',
    'roadmap_stages', 'roadmaps', 'subscriptions', 'usage_ledger', 'user_notes',
    'video_sources'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
--> statement-breakpoint
REVOKE SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anon, authenticated, service_role;
--> statement-breakpoint
GRANT SELECT ON "build_jobs", "build_steps" TO authenticated;
--> statement-breakpoint
-- auth.uid() is wrapped in a SELECT so it is evaluated once per statement rather
-- than once per row. Both lookups are already indexed: build_jobs_requester_created
-- leads with requested_by, and build_steps_job_idx leads with build_job_id.
CREATE POLICY "build_jobs_select_own" ON "build_jobs" FOR SELECT TO authenticated
  USING ((select auth.uid()) = "requested_by");
--> statement-breakpoint
CREATE POLICY "build_steps_select_own" ON "build_steps" FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "build_jobs" j
      WHERE j."id" = "build_steps"."build_job_id"
        AND j."requested_by" = (select auth.uid())
    )
  );
--> statement-breakpoint
-- Realtime evaluates the policy against the row in the WAL. REPLICA IDENTITY DEFAULT
-- would only log the primary key for an UPDATE's old row, so build_job_id can go
-- missing and the policy silently matches nothing. These two tables hold a handful of
-- rows per build, so logging full rows costs nothing.
ALTER TABLE "build_jobs" REPLICA IDENTITY FULL;
--> statement-breakpoint
ALTER TABLE "build_steps" REPLICA IDENTITY FULL;
--> statement-breakpoint
ALTER PUBLICATION supabase_realtime ADD TABLE "build_jobs", "build_steps";
