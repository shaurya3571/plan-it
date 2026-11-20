-- auth.users and its schema already exist in Supabase (managed by Supabase Auth);
-- the FK constraints below reference it, but we never create or alter it ourselves.
CREATE EXTENSION IF NOT EXISTS "citext";
--> statement-breakpoint
CREATE TABLE "build_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid,
	"source_id" uuid NOT NULL,
	"requested_by" uuid NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"step_index" integer DEFAULT 0 NOT NULL,
	"step_total" integer DEFAULT 0 NOT NULL,
	"current_label" text,
	"progress_pct" integer DEFAULT 0 NOT NULL,
	"inngest_run_id" text,
	"error_code" text,
	"error_message" text,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "build_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"build_job_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"provider_label" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"done_count" integer DEFAULT 0 NOT NULL,
	"total_count" integer DEFAULT 0 NOT NULL,
	"attempt" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "provider_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"build_job_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"model" text,
	"kind" text NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"cost_micros" integer,
	"latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"title" text NOT NULL,
	"source_external_id" text
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" "citext" NOT NULL,
	"source_id" uuid NOT NULL,
	"title" text NOT NULL,
	"creator" text,
	"total_minutes" integer NOT NULL,
	"lesson_count" integer DEFAULT 0 NOT NULL,
	"visibility" text DEFAULT 'public' NOT NULL,
	"created_by" uuid,
	"build_status" text DEFAULT 'building' NOT NULL,
	"learners_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug"),
	CONSTRAINT "courses_source_id_unique" UNIQUE("source_id")
);
--> statement-breakpoint
CREATE TABLE "enrollment_lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"day_index" integer NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"completed_at" timestamp with time zone,
	"watch_seconds" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"minutes_per_day" integer NOT NULL,
	"origin" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lesson_note_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"heading" text NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"module_id" uuid,
	"n" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"start_seconds" integer NOT NULL,
	"end_seconds" integer NOT NULL,
	"minutes" integer NOT NULL,
	"video_external_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"at_seconds" integer NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription_id" uuid,
	"provider" text NOT NULL,
	"provider_payment_id" text NOT NULL,
	"amount_minor" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"invoice_url" text,
	"raw_event_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_provider_payment_id_unique" UNIQUE("provider_payment_id")
);
--> statement-breakpoint
CREATE TABLE "placement_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placement_question_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_q_lessons" (
	"placement_question_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	CONSTRAINT "placement_q_lessons_placement_question_id_lesson_id_pk" PRIMARY KEY("placement_question_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "placement_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placement_test_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"question" text NOT NULL,
	"explanation" text
);
--> statement-breakpoint
CREATE TABLE "placement_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	CONSTRAINT "placement_tests_course_id_unique" UNIQUE("course_id")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"monthly_course_limit" integer NOT NULL,
	"monthly_hours_limit" integer NOT NULL,
	"max_video_hours" integer NOT NULL,
	"build_priority" integer NOT NULL,
	"is_lifetime_limit" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"handle" "citext",
	"display_name" text,
	"avatar_url" text,
	"minutes_per_day" integer DEFAULT 90 NOT NULL,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"streak_count" integer DEFAULT 0 NOT NULL,
	"streak_last_active_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_handle_unique" UNIQUE("handle"),
	CONSTRAINT "profiles_minutes_per_day_range" CHECK ("profiles"."minutes_per_day" between 30 and 240)
);
--> statement-breakpoint
CREATE TABLE "placement_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"is_correct" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"quiz_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"is_correct" boolean NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmap_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"roadmap_id" uuid NOT NULL,
	"current_stage_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmap_stage_courses" (
	"roadmap_stage_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	CONSTRAINT "roadmap_stage_courses_roadmap_stage_id_course_id_pk" PRIMARY KEY("roadmap_stage_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "roadmap_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roadmap_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" "citext" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_by" uuid,
	"visibility" text DEFAULT 'public' NOT NULL,
	"learners_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "roadmaps_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "video_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text DEFAULT 'youtube' NOT NULL,
	"external_id" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"channel_title" text,
	"duration_seconds" integer NOT NULL,
	"item_count" integer,
	"chapter_count" integer DEFAULT 0 NOT NULL,
	"raw_meta" jsonb,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_code" text NOT NULL,
	"status" text NOT NULL,
	"provider" text,
	"provider_subscription_id" text,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"question" text NOT NULL,
	"explanation" text,
	"replay_at_seconds" integer,
	CONSTRAINT "quizzes_lesson_id_unique" UNIQUE("lesson_id")
);
--> statement-breakpoint
CREATE TABLE "usage_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" text DEFAULT 'course_build' NOT NULL,
	"course_id" uuid,
	"video_seconds" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_jobs" ADD CONSTRAINT "build_jobs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_jobs" ADD CONSTRAINT "build_jobs_source_id_video_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."video_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_jobs" ADD CONSTRAINT "build_jobs_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_steps" ADD CONSTRAINT "build_steps_build_job_id_build_jobs_id_fk" FOREIGN KEY ("build_job_id") REFERENCES "public"."build_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_calls" ADD CONSTRAINT "provider_calls_build_job_id_build_jobs_id_fk" FOREIGN KEY ("build_job_id") REFERENCES "public"."build_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_source_id_video_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."video_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_lessons" ADD CONSTRAINT "enrollment_lessons_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_lessons" ADD CONSTRAINT "enrollment_lessons_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_note_blocks" ADD CONSTRAINT "lesson_note_blocks_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_options" ADD CONSTRAINT "placement_options_placement_question_id_placement_questions_id_fk" FOREIGN KEY ("placement_question_id") REFERENCES "public"."placement_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_q_lessons" ADD CONSTRAINT "placement_q_lessons_placement_question_id_placement_questions_id_fk" FOREIGN KEY ("placement_question_id") REFERENCES "public"."placement_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_q_lessons" ADD CONSTRAINT "placement_q_lessons_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_questions" ADD CONSTRAINT "placement_questions_placement_test_id_placement_tests_id_fk" FOREIGN KEY ("placement_test_id") REFERENCES "public"."placement_tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_tests" ADD CONSTRAINT "placement_tests_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_attempt_id_placement_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."placement_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_question_id_placement_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."placement_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_option_id_placement_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."placement_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD CONSTRAINT "placement_attempts_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_option_id_quiz_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."quiz_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_enrollments" ADD CONSTRAINT "roadmap_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_enrollments" ADD CONSTRAINT "roadmap_enrollments_roadmap_id_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_stage_courses" ADD CONSTRAINT "roadmap_stage_courses_roadmap_stage_id_roadmap_stages_id_fk" FOREIGN KEY ("roadmap_stage_id") REFERENCES "public"."roadmap_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_stage_courses" ADD CONSTRAINT "roadmap_stage_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_stages" ADD CONSTRAINT "roadmap_stages_roadmap_id_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_code_plans_code_fk" FOREIGN KEY ("plan_code") REFERENCES "public"."plans"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_ledger" ADD CONSTRAINT "usage_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_ledger" ADD CONSTRAINT "usage_ledger_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "build_jobs_requester_created" ON "build_jobs" USING btree ("requested_by","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "build_steps_job_idx" ON "build_steps" USING btree ("build_job_id","idx");--> statement-breakpoint
CREATE UNIQUE INDEX "course_modules_course_idx" ON "course_modules" USING btree ("course_id","idx");--> statement-breakpoint
CREATE INDEX "courses_visibility_learners" ON "courses" USING btree ("visibility","learners_count" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_lessons_enrollment_lesson" ON "enrollment_lessons" USING btree ("enrollment_id","lesson_id");--> statement-breakpoint
CREATE INDEX "enrollment_lessons_day_order" ON "enrollment_lessons" USING btree ("enrollment_id","day_index","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_user_course" ON "enrollments" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_note_blocks_lesson_idx" ON "lesson_note_blocks" USING btree ("lesson_id","idx");--> statement-breakpoint
CREATE UNIQUE INDEX "lessons_course_n" ON "lessons" USING btree ("course_id","n");--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_user_lesson" ON "bookmarks" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "user_notes_user_lesson_at" ON "user_notes" USING btree ("user_id","lesson_id","at_seconds");--> statement-breakpoint
CREATE INDEX "quiz_attempts_enrollment_quiz" ON "quiz_attempts" USING btree ("enrollment_id","quiz_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roadmap_enrollments_user_roadmap" ON "roadmap_enrollments" USING btree ("user_id","roadmap_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roadmap_stages_roadmap_idx" ON "roadmap_stages" USING btree ("roadmap_id","idx");--> statement-breakpoint
CREATE UNIQUE INDEX "video_sources_provider_external_id" ON "video_sources" USING btree ("provider","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_one_active_per_user" ON "subscriptions" USING btree ("user_id") WHERE "subscriptions"."status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_options_quiz_idx" ON "quiz_options" USING btree ("quiz_id","idx");--> statement-breakpoint
CREATE INDEX "usage_ledger_user_window" ON "usage_ledger" USING btree ("user_id","created_at" DESC NULLS LAST);