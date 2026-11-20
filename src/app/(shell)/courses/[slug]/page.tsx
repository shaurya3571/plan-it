import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayPlan } from "@/components/course/day-plan";
import { courseDetails, getCourse, thumbnailUrl } from "@/content/courses";
import { formatDuration } from "@/lib/plan";

export function generateStaticParams() {
  return Object.keys(courseDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  return { title: course?.title ?? "Course not found" };
}

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const firstLesson = course.days[0].lessons[0];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-20 sm:px-6 lg:pt-[108px]">
      <p className="text-[0.92rem] text-ink-soft">
        {course.creator} · {formatDuration(course.minutes)} · {course.lessonCount}{" "}
        lessons
      </p>
      <h1 className="mt-2 text-[clamp(1.8rem,3.6vw,2.6rem)]">{course.title}</h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="relative aspect-video overflow-hidden rounded-card bg-muted shadow-hairline">
          <Image
            src={thumbnailUrl(course.youtubeId)}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 680px"
            className="object-cover"
            priority
          />
          <Link
            href={`/learn/${course.slug}/${firstLesson.n}`}
            aria-label={`Start lesson 1: ${firstLesson.title}`}
            className="absolute inset-0 flex items-center justify-center bg-night/25 transition-colors hover:bg-night/40"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-paper/90">
              <Play className="size-6 translate-x-0.5 fill-ink text-ink" />
            </span>
          </Link>
        </div>

        <div className="flex flex-col justify-center rounded-card bg-surface p-[26px] shadow-hairline">
          <h2 className="text-[1.25rem]">
            Already know some of this?{" "}
            <em className="italic text-moss">A 2-minute test skips it.</em>
          </h2>
          <p className="mt-2 text-[0.92rem] text-ink-soft">
            The placement test drops the lessons you can already pass out of your
            plan.
          </p>
          <Button asChild size="pill" className="mt-5 self-start">
            <Link href={`/learn/${course.slug}/${firstLesson.n}?test=1`}>
              Take the placement test
            </Link>
          </Button>
        </div>
      </div>

      <DayPlan course={course} />
    </div>
  );
}
