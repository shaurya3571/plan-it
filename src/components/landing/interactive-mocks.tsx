"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { features } from "@/content/landing";
import { daysForCourse } from "@/lib/plan";

/** Video / Article toggle. */
export function NotesMock() {
  const { tabs, article } = features.notes;
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Lesson format"
        className="inline-flex gap-1 rounded-full p-1 ring-line"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "min-h-[38px] rounded-full px-4 text-[0.85rem] font-medium transition-colors",
              active === i ? "bg-lime-soft text-pill-ink" : "text-ink-soft hover:text-ink",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === 0 ? (
        <div className="relative mt-4 flex aspect-[2/1] items-center justify-center rounded-[14px] bg-night">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/20">
            <Play className="size-3.5 fill-paper text-paper" />
          </span>
          <div className="absolute inset-x-3 bottom-2.5 h-1.5 rounded-full bg-lime-soft">
            <div className="h-full w-[46%] rounded-full bg-moss" />
          </div>
        </div>
      ) : (
        <ul className="mt-4 flex aspect-[2/1] flex-col justify-center gap-2 overflow-hidden rounded-[14px] bg-muted px-4">
          {article.map((line) => (
            <li key={line} className="text-[0.78rem] leading-snug text-ink-soft">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Daily-minutes picker driving the day count. */
export function PaceMock() {
  const { options, defaultOption, courseMinutes, courseLabel } = features.pace;
  const [perDay, setPerDay] = useState<number>(defaultOption);
  const days = daysForCourse(courseMinutes, perDay);

  return (
    <div>
      <div role="group" aria-label="Minutes per day" className="flex flex-wrap gap-1.5">
        {options.map((option) => (
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
        {courseLabel} · {days} {days === 1 ? "day" : "days"}
      </p>
    </div>
  );
}
