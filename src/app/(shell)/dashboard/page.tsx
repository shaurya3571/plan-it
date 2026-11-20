import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { learner } from "@/content/shell";

export const metadata: Metadata = { title: "Home" };

export default function DashboardPage() {
  const { today } = learner;
  const progress = Math.round((today.lessonsDone / today.lessonsTotal) * 100);

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-20 sm:px-6 lg:pt-[108px]">
      <h1 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">
        Welcome back, <em className="italic text-moss">{learner.name}.</em>
      </h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rounded-card bg-surface p-[26px] shadow-hairline">
          <p className="font-mono text-label tracking-[0.07em] text-ink-soft uppercase">
            Today · Day {today.day} of {today.totalDays}
          </p>
          <h2 className="mt-2 text-[1.35rem]">{today.courseTitle}</h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-lime-soft">
              <span
                className="block h-full rounded-full bg-moss"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="font-mono text-[0.8rem] text-ink-soft tabular-nums">
              {today.lessonsDone}/{today.lessonsTotal}
            </span>
          </div>

          <p className="mt-5 text-[0.92rem] text-ink-soft">
            Up next · lesson {today.nextLesson.n} · {today.nextLesson.minutes}m
          </p>
          <p className="mt-1 text-[1.05rem] font-medium text-ink">
            {today.nextLesson.title}
          </p>

          <Button asChild size="pill" className="mt-5">
            <Link href={`/learn/${today.courseSlug}/${today.nextLesson.n}`}>
              Continue
              <ArrowRight />
            </Link>
          </Button>
        </section>

        <section className="flex flex-col gap-4">
          <div className="rounded-card bg-lime-soft p-[26px] text-pill-ink">
            <p className="flex items-center gap-1.5 font-mono text-label tracking-[0.07em] uppercase opacity-70">
              <Flame className="size-3.5" />
              Streak
            </p>
            <p className="mt-2 font-display text-[2.6rem] leading-none tabular-nums">
              {learner.streak}
            </p>
            <p className="mt-1 text-[0.88rem] opacity-80">
              days in a row at {learner.minutesPerDay} min
            </p>
          </div>

          <Button asChild variant="quiet" size="pill" className="h-12 bg-surface">
            <Link href="/new">Build a new course</Link>
          </Button>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-[1.6rem]">Your courses</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learner.enrolled.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.6rem]">Your roadmaps</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {learner.roadmaps.map((roadmap) => (
            <article
              key={roadmap.title}
              className="rounded-card bg-surface p-[26px] shadow-hairline"
            >
              <h3 className="font-medium">{roadmap.title}</h3>
              <ol className="mt-4 flex flex-wrap items-center gap-2">
                {roadmap.stages.map((stage, i) => (
                  <li key={stage} className="inline-flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-[7px] text-[0.85rem] font-medium ${
                        i + 1 === roadmap.stage
                          ? "bg-moss text-on-moss"
                          : "bg-lime-soft text-pill-ink"
                      }`}
                    >
                      <span className="tabular-nums opacity-70">{i + 1}</span>
                      {stage}
                    </span>
                    {i < roadmap.stages.length - 1 && (
                      <span aria-hidden="true" className="text-ink-soft">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex items-center gap-1.5 text-[0.88rem] text-ink-soft">
                <Users className="size-4" />
                {roadmap.learners.toLocaleString("en-IN")} learners enrolled
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
