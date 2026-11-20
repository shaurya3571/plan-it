import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Course, thumbnailUrl } from "@/content/courses";
import { formatDuration } from "@/lib/plan";

export function CourseCard({
  course,
  className,
}: {
  course: Course;
  className?: string;
}) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-card bg-surface p-[14px] shadow-hairline transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_var(--line),0_22px_44px_-30px_rgba(22,49,92,0.5)] motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-[14px] bg-muted">
        <Image
          src={thumbnailUrl(course.youtubeId)}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-cover"
        />
        <span className="absolute right-2 bottom-2 rounded-md bg-night/85 px-1.5 py-0.5 font-mono text-[0.7rem] text-white tabular-nums">
          {formatDuration(course.minutes)}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1.5">
        <h3 className="line-clamp-2 text-[1.05rem] leading-snug">{course.title}</h3>
        <p className="mt-1.5 text-[0.88rem] text-ink-soft">{course.creator}</p>

        <div className="mt-auto flex items-center justify-end gap-2 border-t border-line pt-3 text-[0.78rem] text-ink-soft">
          <span className="shrink-0 tabular-nums">{course.learning} learning</span>
        </div>
      </div>
    </Link>
  );
}
