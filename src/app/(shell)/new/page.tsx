import type { Metadata } from "next";
import { NewCourseForm } from "@/components/new-course-form";
import { requireProfile } from "@/server/auth/guards";

export const metadata: Metadata = { title: "New course" };

export default async function NewCoursePage() {
  const { minutesPerDay } = await requireProfile();

  return (
    <div className="mx-auto w-full max-w-[860px] px-4 pt-8 pb-20 sm:px-6 lg:pt-[108px]">
      <h1 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">
        Paste a link, <em className="italic text-moss">get a course.</em>
      </h1>
      <p className="mt-3 text-[1.02rem] text-ink-soft">
        Any YouTube video, or a playlist up to 20 hours. Lesson 1 is ready to watch
        while the rest is written.
      </p>

      <NewCourseForm minutesPerDay={minutesPerDay} />
    </div>
  );
}
