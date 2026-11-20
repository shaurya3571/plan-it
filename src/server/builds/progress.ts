import { and, eq } from "drizzle-orm";
import { BUILD_STEPS, BUILD_STEP_TOTAL } from "../../content/build-steps";
import { db } from "../db";
import { buildJobs, buildSteps } from "../db/schema";

/**
 * Every write to build_jobs and build_steps goes through here, so the progress
 * the /build/[slug] screen reads over Realtime is computed in one place.
 */

const ERROR_LIMIT = 500;

/** Held below 100 until the job itself finishes, so the bar never sits full on an unfinished build. */
function overallPct(idx: number, doneCount: number, totalCount: number) {
  const withinStep = totalCount > 0 ? Math.min(1, doneCount / totalCount) : 0;
  return Math.min(99, Math.round(((idx + withinStep) / BUILD_STEP_TOTAL) * 100));
}

function stepRow(jobId: string, idx: number) {
  return and(eq(buildSteps.buildJobId, jobId), eq(buildSteps.idx, idx));
}

export async function startStep(jobId: string, idx: number, totalCount = 0) {
  const step = BUILD_STEPS[idx]!;
  await db
    .update(buildSteps)
    .set({ status: "working", startedAt: new Date(), totalCount, doneCount: 0, error: null })
    .where(stepRow(jobId, idx));
  await db
    .update(buildJobs)
    .set({
      status: "running",
      stepIndex: idx + 1,
      currentLabel: step.label,
      progressPct: overallPct(idx, 0, totalCount),
      ...(idx === 0 ? { startedAt: new Date() } : {}),
    })
    .where(eq(buildJobs.id, jobId));
}

/** "15 of 17 done" on a step that works through a list. */
export async function bumpStep(jobId: string, idx: number, doneCount: number, totalCount: number) {
  await db.update(buildSteps).set({ doneCount }).where(stepRow(jobId, idx));
  await db
    .update(buildJobs)
    .set({ progressPct: overallPct(idx, doneCount, totalCount) })
    .where(eq(buildJobs.id, jobId));
}

export async function finishStep(jobId: string, idx: number, doneCount?: number) {
  await db
    .update(buildSteps)
    .set({
      status: "done",
      finishedAt: new Date(),
      ...(doneCount === undefined ? {} : { doneCount }),
    })
    .where(stepRow(jobId, idx));
  await db
    .update(buildJobs)
    .set({ progressPct: overallPct(idx + 1, 0, 0) })
    .where(eq(buildJobs.id, jobId));
}

export async function finishJob(jobId: string) {
  await db
    .update(buildJobs)
    .set({
      status: "succeeded",
      progressPct: 100,
      stepIndex: BUILD_STEP_TOTAL,
      currentLabel: null,
      finishedAt: new Date(),
    })
    .where(eq(buildJobs.id, jobId));
}

/**
 * Called from the Inngest function's onFailure, which only fires once the step's
 * retries are exhausted. Whichever step was mid-flight is the one that failed,
 * so the caller does not have to track an index across retries.
 */
export async function failJob(jobId: string, message: string) {
  const error = message.slice(0, ERROR_LIMIT);
  await db
    .update(buildSteps)
    .set({ status: "failed", error, finishedAt: new Date() })
    .where(and(eq(buildSteps.buildJobId, jobId), eq(buildSteps.status, "working")));
  await db
    .update(buildJobs)
    .set({ status: "failed", errorMessage: error, finishedAt: new Date() })
    .where(eq(buildJobs.id, jobId));
}
