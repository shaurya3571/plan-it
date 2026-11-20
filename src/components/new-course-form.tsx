"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Link2, ListVideo, Loader2, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { parseYoutubeUrl, type YoutubeTarget } from "@/lib/youtube";
import { features } from "@/content/landing";
import { startBuild, type BuildFormState } from "@/app/(shell)/new/actions";

const PACE = features.pace.options;
const EMPTY: BuildFormState = { error: null };

export function NewCourseForm({ minutesPerDay }: { minutesPerDay: number }) {
  const [url, setUrl] = useState("");
  const [perDay, setPerDay] = useState(minutesPerDay);
  const [state, formAction, isPending] = useActionState(startBuild, EMPTY);
  const [touched, setTouched] = useState(false);

  const target: YoutubeTarget = parseYoutubeUrl(url);
  // the server checks the link again; this is only so a typo shows up before submitting
  const clientError =
    touched && url.length > 0 && !target
      ? "That doesn't look like a YouTube video or playlist link."
      : null;
  const error = clientError ?? state.error;

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="minutesPerDay" value={perDay} />

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
            name="url"
            // Not type="url": that rejects the scheme-less "youtube.com/watch?v=..."
            // this placeholder asks for, which parseYoutubeUrl accepts on purpose.
            type="text"
            inputMode="url"
            value={url}
            disabled={isPending}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="youtube.com/watch?v=…"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-soft"
          />
        </div>
        <Button size="pill" type="submit" disabled={isPending || !url}>
          {isPending ? <Loader2 className="animate-spin" /> : null}
          {isPending ? "Building" : "Build course"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[0.88rem] text-err-fg">
          {error}
        </p>
      )}

      {target && !isPending && (
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

      <fieldset className="mt-8" disabled={isPending}>
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
                perDay === option ? "bg-moss text-on-moss" : "ring-line hover:bg-muted",
              )}
            >
              {option} min
            </button>
          ))}
        </div>
        {/* The course length is only known once the server has asked YouTube, so the
            day count belongs on the build screen rather than here. */}
        <p className="mt-[18px] font-display text-[2.4rem] leading-[1.05] tracking-[-0.02em] tabular-nums">
          {perDay} minutes a day
        </p>
      </fieldset>
    </form>
  );
}
