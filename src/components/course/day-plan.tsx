"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CourseDetail } from "@/content/courses";
import { formatDuration } from "@/lib/plan";

export function DayPlan({ course }: { course: CourseDetail }) {
  const [day, setDay] = useState(0);
  const lessons = course.days[day].lessons;
  const dayMinutes = lessons.reduce((sum, l) => sum + l.minutes, 0);

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[1.6rem]">The plan</h2>
        <p className="text-[0.92rem] text-ink-soft">
          {course.days.length} days at {course.minutesPerDay} min a day
        </p>
      </div>

      <div role="tablist" aria-label="Days" className="mt-4 flex flex-wrap gap-1.5">
        {course.days.map((_, i) => (
          <button
            key={i}
            role="tab"
            type="button"
            aria-selected={day === i}
            onClick={() => setDay(i)}
            className={cn(
              "h-11 rounded-full px-4 text-[0.88rem] font-medium transition-colors",
              day === i ? "bg-moss text-on-moss" : "ring-line hover:bg-muted",
            )}
          >
            Day {i + 1}
            {i === 0 && (
              <span className="ml-1.5 opacity-70">(today)</span>
            )}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[0.92rem] text-ink-soft">
        <span className="font-medium text-ink">Day {day + 1}</span> ·{" "}
        {lessons.length} lessons · {formatDuration(dayMinutes)}
      </p>

      <ol className="mt-4 overflow-hidden rounded-card bg-surface shadow-hairline">
        {lessons.map((lesson, i) => (
          <li key={lesson.n}>
            <Link
              href={`/learn/${course.slug}/${lesson.n}`}
              className={cn(
                "flex gap-4 px-5 py-4 transition-colors hover:bg-muted",
                i > 0 && "border-t border-line",
              )}
            >
              <span className="mt-0.5 w-6 shrink-0 font-mono text-[0.85rem] text-ink-soft tabular-nums">
                {lesson.n}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1rem] font-medium text-ink">
                  {lesson.title}
                </span>
                <span className="mt-1 block text-[0.88rem] leading-relaxed text-ink-soft">
                  {lesson.summary}
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-2 text-[0.78rem] text-ink-soft">
                  <span className="font-mono tabular-nums">{lesson.minutes}m</span>
                  <span className="rounded-full bg-lime-soft px-2.5 py-1 text-pill-ink">
                    Notes and quiz
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
