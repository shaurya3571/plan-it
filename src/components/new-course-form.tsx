"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Link2, ListVideo, Loader2, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { parseYoutubeUrl, type YoutubeTarget } from "@/lib/youtube";
import { features } from "@/content/landing";
import { buildPreview } from "@/content/app-preview";
import { daysForCourse } from "@/lib/plan";

const PACE = features.pace.options;
/** shortcut: fixed sample length, no API to ask YouTube how long the video is. */
const SAMPLE_MINUTES = 316;

type Stage = "idle" | "building";

export function NewCourseForm() {
  const [url, setUrl] = useState("");
  const [perDay, setPerDay] = useState<number>(90);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);

  const target: YoutubeTarget = parseYoutubeUrl(url);
  const days = daysForCourse(SAMPLE_MINUTES, perDay);

  function build() {
    if (!target) {
      setError("That doesn't look like a YouTube video or playlist link.");
      return;
    }
    setError(null);
    setStage("building");
  }

  return (
    <div className="mt-8">
      <label
        htmlFor="yt-url"
        className="font-mono text-label tracking-[0.07em] text-ink-soft uppercase"
      >
        YouTube link
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full bg-surface px-4 py-3.5 font-mono text-[0.88rem] ring-line focus-within:shadow-[inset_0_0_0_2px_var(--moss)]">
          <Link2 className="size-4 shrink-0 text-moss" />
          <input
            id="yt-url"
            type="url"
            inputMode="url"
            value={url}
            disabled={stage === "building"}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="youtube.com/watch?v=…"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-soft"
          />
        </div>
        <Button size="pill" onClick={build} disabled={stage === "building" || !url}>
          {stage === "building" ? <Loader2 className="animate-spin" /> : null}
          {stage === "building" ? "Building" : "Build course"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[0.88rem] text-err-fg">
          {error}
        </p>
      )}

      {target && stage === "idle" && (
        <div className="mt-4 flex items-center gap-4 rounded-card bg-surface p-4 shadow-hairline">
          {target.kind === "video" ? (
            <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={`https://i.ytimg.com/vi/${target.id}/mqdefault.jpg`}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          ) : (
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-lime-soft text-pill-ink">
              <ListVideo className="size-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[0.92rem] font-medium text-ink">
              {target.kind === "video" ? (
                <Video className="size-4 text-moss" />
              ) : (
                <ListVideo className="size-4 text-moss" />
              )}
              {target.kind === "video" ? "Video" : "Playlist"} detected
            </p>
            <p className="mt-1 truncate font-mono text-[0.78rem] text-ink-soft">
              {target.id}
            </p>
          </div>
        </div>
      )}

      <fieldset className="mt-8" disabled={stage === "building"}>
        <legend className="font-mono text-label tracking-[0.07em] text-ink-soft uppercase">
          Minutes a day
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PACE.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={perDay === option}
              onClick={() => setPerDay(option)}
              className={cn(
                "h-11 rounded-full px-3.5 text-[0.88rem] font-medium transition-colors",
                perDay === option
                  ? "bg-moss text-on-moss"
                  : "ring-line hover:bg-muted",
              )}
            >
              {option} min
            </button>
          ))}
        </div>
        <p className="mt-[18px] font-display text-[2.4rem] leading-[1.05] tracking-[-0.02em] tabular-nums">
          A 5h course · {days} {days === 1 ? "day" : "days"}
        </p>
      </fieldset>

      {stage === "building" && (
        <section className="mt-8 rounded-card bg-surface p-[26px] shadow-hairline">
          <h2 className="text-[1.35rem]">
            Building your <em className="italic text-moss">course.</em>
          </h2>
          <p className="mt-1.5 text-[0.92rem] text-ink-soft">{buildPreview.note}</p>

          <ul className="mt-5 space-y-2">
            {buildPreview.tasks.map((task) => (
              <li
                key={task.label}
                className="flex items-center gap-3 rounded-xl bg-muted px-3.5 py-2.5 text-[0.88rem]"
              >
                <span className="shrink-0 font-mono text-[0.78rem] text-ink-soft tabular-nums">
                  {task.at}
                </span>
                <span className="min-w-0 flex-1 truncate text-ink">{task.label}</span>
                <Check className="size-4 shrink-0 text-moss" />
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[0.88rem] text-ink-soft">
            {/* No backend — this screen is the design, not a running build. */}
            Preview only: plan-it has no build service yet, so this stops here.
          </p>
        </section>
      )}
    </div>
  );
}
