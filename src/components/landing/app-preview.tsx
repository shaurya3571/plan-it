import { ArrowLeft, Clock } from "lucide-react";
import { buildPreview } from "@/content/app-preview";

/**
 * Static stand-in for the product tour. The original plays a screen recording
 * here; we render the same screen as markup so there is nothing to ship.
 */
export function AppPreview() {
  return (
    <div className="flex size-full flex-col bg-paper text-ink">
      {/* browser chrome */}
      <div className="flex shrink-0 items-center gap-2 border-b border-line bg-muted px-3 py-2">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ec6a5e]" />
          <span className="size-2.5 rounded-full bg-[#f4bf4f]" />
          <span className="size-2.5 rounded-full bg-[#61c454]" />
        </span>
        <span className="ml-2 truncate rounded-md bg-surface px-2 py-1 font-mono text-[0.6rem] text-ink-soft shadow-hairline">
          {buildPreview.url}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-[3%]">
        <div className="flex items-center justify-between gap-3 text-[0.62rem] text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeft className="size-3" />
            Back to home
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3" />
            {buildPreview.note}
          </span>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 sm:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col">
            <p className="inline-flex w-fit rounded-full bg-lime-soft px-2.5 py-1 text-[0.6rem] font-medium text-pill-ink">
              {buildPreview.step}
            </p>
            <h3 className="mt-2 text-[clamp(1rem,2.4vw,1.7rem)]">
              Building your <em className="italic text-moss">course.</em>
            </h3>

            <div className="mt-3 flex items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-lime-soft">
                <span
                  className="block h-full rounded-full bg-moss"
                  style={{ width: `${buildPreview.progress}%` }}
                />
              </span>
              <span className="font-mono text-[0.6rem] text-ink-soft tabular-nums">
                {buildPreview.progress}%
              </span>
            </div>

            <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-hidden">
              {buildPreview.tasks.map((task) => (
                <li
                  key={task.label}
                  className="flex items-center gap-2 rounded-lg bg-surface px-2.5 py-1.5 text-[0.62rem] shadow-hairline"
                >
                  <span className="shrink-0 font-mono text-ink-soft tabular-nums">
                    {task.at}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-ink">{task.label}</span>
                  <span className="shrink-0 rounded-full bg-ok-bg px-1.5 py-0.5 font-mono text-[0.52rem] tracking-wide text-ok-fg uppercase">
                    Done
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            {buildPreview.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-lime-soft px-3 py-2.5 text-pill-ink"
              >
                <p className="font-mono text-[0.52rem] tracking-widest uppercase opacity-70">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-[clamp(1.1rem,3vw,2rem)] leading-none tabular-nums">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
