import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "./_helpers";
import { courses } from "./courses";
import { videoSources } from "./sources";

export const buildJobs = pgTable(
  "build_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").references(() => courses.id),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => videoSources.id),
    requestedBy: uuid("requested_by")
      .notNull()
      .references(() => authUsers.id),
    status: text("status").notNull().default("queued"), // 'queued'|'running'|'succeeded'|'failed'|'cancelled'
    stepIndex: integer("step_index").notNull().default(0),
    stepTotal: integer("step_total").notNull().default(0), // "Step 1 of 2"
    currentLabel: text("current_label"),
    progressPct: integer("progress_pct").notNull().default(0),
    inngestRunId: text("inngest_run_id"),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("build_jobs_requester_created").on(t.requestedBy, t.createdAt.desc())],
);

/** Realtime publishes this table to /build/[slug]. */
export const buildSteps = pgTable(
  "build_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    buildJobId: uuid("build_job_id")
      .notNull()
      .references(() => buildJobs.id, { onDelete: "cascade" }),
    idx: integer("idx").notNull(),
    key: text("key").notNull(),
    label: text("label").notNull(),
    providerLabel: text("provider_label"), // 'SUPADATA' | 'NEMOTRON 3 ULTRA' | 'NEMOTRON 3 SUPER'
    status: text("status").notNull().default("pending"), // 'pending'|'working'|'done'|'failed'
    doneCount: integer("done_count").notNull().default(0),
    totalCount: integer("total_count").notNull().default(0), // "15 of 17 done"
    attempt: integer("attempt").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    error: text("error"),
  },
  (t) => [uniqueIndex("build_steps_job_idx").on(t.buildJobId, t.idx)],
);

/** Real per-call cost/latency, so pricing can be set from data instead of estimates. */
export const providerCalls = pgTable("provider_calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  buildJobId: uuid("build_job_id")
    .notNull()
    .references(() => buildJobs.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  model: text("model"),
  kind: text("kind").notNull(),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  costMicros: integer("cost_micros"),
  latencyMs: integer("latency_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
