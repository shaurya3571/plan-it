import type { Metadata } from "next";
import { Users } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { popularCourses } from "@/content/courses";
import { learner } from "@/content/shell";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-20 sm:px-6 lg:pt-[108px]">
      <h1 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">
        Courses other people <em className="italic text-moss">already built.</em>
      </h1>
      <p className="mt-3 max-w-[60ch] text-[1.02rem] text-ink-soft">
        Every course here is free to join on any plan. Joining one costs nothing
        against your monthly builds.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popularCourses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      <section id="roadmaps" className="mt-14 scroll-mt-28">
        <h2 className="text-[1.6rem]">Roadmaps</h2>
        <p className="mt-2 text-[0.95rem] text-ink-soft">
          Courses from many creators, chained into stages.
        </p>

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
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-soft px-3 py-[7px] text-[0.85rem] font-medium text-pill-ink">
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
              <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[0.88rem] text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" />
                  {roadmap.learners.toLocaleString("en-IN")} learners enrolled
                </span>
                <span className="ml-auto inline-flex h-10 items-center rounded-full bg-moss px-4 font-medium text-on-moss">
                  Enroll in roadmap
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
