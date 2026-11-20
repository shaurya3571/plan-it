import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { BuildProgress } from "@/components/build/build-progress";
import { daysForCourse } from "@/lib/plan";
import { requireProfile } from "@/server/auth/guards";
import { db } from "@/server/db";
import { buildJobs, buildSteps, courses } from "@/server/db/schema";

export const metadata: Metadata = { title: "Building your course" };

export default async function BuildPage({ params }: PageProps<"/build/[slug]">) {
  const { slug } = await params;
  const { user, minutesPerDay } = await requireProfile();

  const [job] = await db
    .select({
      jobId: buildJobs.id,
      status: buildJobs.status,
      stepIndex: buildJobs.stepIndex,
      stepTotal: buildJobs.stepTotal,
      currentLabel: buildJobs.currentLabel,
      progressPct: buildJobs.progressPct,
      errorMessage: buildJobs.errorMessage,
      startedAt: buildJobs.startedAt,
      requestedBy: buildJobs.requestedBy,
      buildStatus: courses.buildStatus,
      totalMinutes: courses.totalMinutes,
    })
    .from(courses)
    .innerJoin(buildJobs, eq(buildJobs.courseId, courses.id))
    .where(eq(courses.slug, slug))
    .orderBy(desc(buildJobs.createdAt))
    .limit(1);

  // A 404 rather than a 403 for someone else's build: whether a given slug is
  // being built is itself not theirs to know.
  if (!job || job.requestedBy !== user.id) notFound();
  if (job.buildStatus === "ready") redirect(`/courses/${slug}`);

  const steps = await db
    .select({
      idx: buildSteps.idx,
      key: buildSteps.key,
      label: buildSteps.label,
      providerLabel: buildSteps.providerLabel,
      status: buildSteps.status,
      doneCount: buildSteps.doneCount,
      totalCount: buildSteps.totalCount,
      startedAt: buildSteps.startedAt,
      finishedAt: buildSteps.finishedAt,
      error: buildSteps.error,
    })
    .from(buildSteps)
    .where(eq(buildSteps.buildJobId, job.jobId))
    .orderBy(asc(buildSteps.idx));

  // Realtime sends timestamps as strings, so send strings from here too and the
  // client has one shape to render either way.
  return (
    <BuildProgress
      slug={slug}
      days={daysForCourse(job.totalMinutes, minutesPerDay)}
      job={{
        jobId: job.jobId,
        status: job.status,
        stepIndex: job.stepIndex,
        stepTotal: job.stepTotal,
        currentLabel: job.currentLabel,
        progressPct: job.progressPct,
        errorMessage: job.errorMessage,
        startedAt: job.startedAt?.toISOString() ?? null,
      }}
      steps={steps.map((step) => ({
        ...step,
        startedAt: step.startedAt?.toISOString() ?? null,
        finishedAt: step.finishedAt?.toISOString() ?? null,
      }))}
    />
  );
}
