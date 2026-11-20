"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPreview } from "@/content/app-preview";
import { formatClock } from "@/lib/plan";
import { createClient } from "@/server/auth/client";

export type JobRow = {
  jobId: string;
  status: string;
  stepIndex: number;
  stepTotal: number;
  currentLabel: string | null;
  progressPct: number;
  errorMessage: string | null;
  startedAt: string | null;
};

export type StepRow = {
  idx: number;
  key: string;
  label: string;
  providerLabel: string | null;
  status: string;
  doneCount: number;
  totalCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
};

type Row = Record<string, unknown>;

const str = (value: unknown) => (typeof value === "string" ? value : null);
const num = (value: unknown, fallback = 0) => (typeof value === "number" ? value : fallback);

function toJob(row: Row): Omit<JobRow, "jobId"> {
  return {
    status: str(row.status) ?? "queued",
    stepIndex: num(row.step_index),
    stepTotal: num(row.step_total),
    currentLabel: str(row.current_label),
    progressPct: num(row.progress_pct),
    errorMessage: str(row.error_message),
    startedAt: str(row.started_at),
  };
}

function toStep(row: Row): StepRow {
  return {
    idx: num(row.idx),
    key: str(row.key) ?? "",
    label: str(row.label) ?? "",
    providerLabel: str(row.provider_label),
    status: str(row.status) ?? "pending",
    doneCount: num(row.done_count),
    totalCount: num(row.total_count),
    startedAt: str(row.started_at),
    finishedAt: str(row.finished_at),
    error: str(row.error),
  };
}

/** "0:06" since the job started, which is what the step list shows per row. */
function elapsed(jobStartedAt: string | null, at: string | null) {
  if (!jobStartedAt || !at) return "—";
  return formatClock((Date.parse(at) - Date.parse(jobStartedAt)) / 1000);
}

export function BuildProgress({
  slug,
  job: initialJob,
  steps: initialSteps,
  days,
}: {
  slug: string;
  job: JobRow;
  steps: StepRow[];
  days: number;
}) {
  const router = useRouter();
  const [job, setJob] = useState(initialJob);
  const [steps, setSteps] = useState(initialSteps);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`build-${job.jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "build_jobs",
          filter: `id=eq.${job.jobId}`,
        },
        (payload) => setJob((prev) => ({ ...prev, ...toJob(payload.new as Row) })),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "build_steps",
          filter: `build_job_id=eq.${job.jobId}`,
        },
        (payload) => {
          const next = toStep(payload.new as Row);
          setSteps((prev) =>
            prev.some((step) => step.idx === next.idx)
              ? prev.map((step) => (step.idx === next.idx ? next : step))
              : [...prev, next].sort((a, b) => a.idx - b.idx),
          );
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [job.jobId]);

  useEffect(() => {
    if (job.status === "succeeded") router.replace(`/courses/${slug}`);
  }, [job.status, router, slug]);

  const failed = job.status === "failed";
  const lessonCount = steps.find((step) => step.key === "notes")?.totalCount ?? 0;
  const quizCount = steps.find((step) => step.key === "quizzes")?.doneCount ?? 0;

  const stats = [
    { label: "Lessons", value: lessonCount > 0 ? String(lessonCount) : "—" },
    { label: "Days", value: String(days) },
    { label: "Quizzes", value: quizCount > 0 ? String(quizCount) : "—" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-20 sm:px-6 lg:pt-[108px]">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[0.92rem] text-ink-soft">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" />
          {buildPreview.note}
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
        <div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-lime-soft px-3 py-1 text-[0.82rem] font-medium text-pill-ink">
            {failed
              ? "Build failed"
              : `Step ${Math.max(1, job.stepIndex)} of ${job.stepTotal || steps.length}`}
            {job.currentLabel ? ` · ${job.currentLabel}` : null}
          </p>

          <h1 className="mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)]">
            {failed ? (
              <>
                Something broke <em className="italic text-moss">mid-build.</em>
              </>
            ) : (
              <>
                Building your <em className="italic text-moss">course.</em>
              </>
            )}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-lime-soft">
              <span
                className="block h-full rounded-full bg-moss transition-[width] duration-500"
                style={{ width: `${job.progressPct}%` }}
              />
            </span>
            <span className="font-mono text-[0.82rem] text-ink-soft tabular-nums">
              {job.progressPct}%
            </span>
          </div>

          <p className="mt-2 font-mono text-[0.72rem] tracking-wide text-ink-soft uppercase">
            {live ? "Live" : "Reconnecting…"}
          </p>

          <ul className="mt-5 space-y-2">
            {steps.map((step) => (
              <li
                key={step.idx}
                className="flex items-center gap-3 rounded-xl bg-surface px-3.5 py-2.5 text-[0.88rem] shadow-hairline"
              >
                <span className="shrink-0 font-mono text-[0.78rem] text-ink-soft tabular-nums">
                  {elapsed(job.startedAt, step.startedAt)}
                </span>
                <span className="min-w-0 flex-1 truncate text-ink">
                  {step.label}
                  {step.totalCount > 1 && step.status !== "pending" ? (
                    <span className="ml-2 font-mono text-[0.78rem] text-ink-soft tabular-nums">
                      {step.doneCount} of {step.totalCount} done
                    </span>
                  ) : null}
                </span>
                {step.providerLabel ? (
                  <span className="hidden shrink-0 font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase sm:inline">
                    {step.providerLabel}
                  </span>
                ) : null}
                <StepBadge status={step.status} />
              </li>
            ))}
          </ul>

          {failed && (
            <div className="mt-5 rounded-card bg-surface p-[26px] shadow-hairline">
              <p className="text-[0.92rem] text-ink">
                {job.errorMessage ?? "The build stopped before it finished."}
              </p>
              <Button asChild size="pill" className="mt-4 self-start">
                <Link href="/new">Try another link</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-lime-soft px-4 py-3.5 text-pill-ink">
              <p className="font-mono text-[0.68rem] tracking-widest uppercase opacity-70">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBadge({ status }: { status: string }) {
  if (status === "done") {
    return <Check className="size-4 shrink-0 text-moss" aria-label="Done" />;
  }
  if (status === "working") {
    return <Loader2 className="size-4 shrink-0 animate-spin text-moss" aria-label="Working" />;
  }
  if (status === "failed") {
    return <TriangleAlert className="size-4 shrink-0 text-err-fg" aria-label="Failed" />;
  }
  return (
    <span className="size-4 shrink-0 rounded-full ring-1 ring-line" aria-label="Waiting" />
  );
}
