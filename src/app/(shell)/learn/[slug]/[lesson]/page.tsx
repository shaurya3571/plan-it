import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonPanel } from "@/components/course/lesson-panel";
import { getCourseLessonList, getLessonDetail } from "@/server/courses";

export async function generateMetadata({
  params,
}: PageProps<"/learn/[slug]/[lesson]">): Promise<Metadata> {
  const { slug, lesson } = await params;
  const current = await getLessonDetail(slug, Number(lesson));
  return { title: current?.title ?? "Lesson" };
}

export default async function LessonPage({
  params,
}: PageProps<"/learn/[slug]/[lesson]">) {
  const { slug, lesson } = await params;
  const n = Number(lesson);
  if (!Number.isInteger(n) || n < 1) notFound();

  const current = await getLessonDetail(slug, n);
  if (!current) notFound();

  const all = await getCourseLessonList(slug);

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-20 sm:px-6 lg:pt-[108px]">
      <Link
        href={`/courses/${slug}`}
        className="inline-flex items-center gap-1.5 text-[0.88rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        {current.courseTitle}
      </Link>

      <p className="mt-5 font-mono text-label tracking-[0.07em] text-ink-soft uppercase">
        Lesson {current.n} of {all.length} · {current.minutes}m
      </p>
      <h1 className="mt-2 text-[clamp(1.5rem,3vw,2.2rem)]">{current.title}</h1>
      <p className="mt-2 max-w-[70ch] text-[0.98rem] leading-relaxed text-ink-soft">
        {current.summary}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <LessonPanel
          youtubeId={current.videoExternalId}
          noteBlocks={current.noteBlocks}
          quiz={current.quiz}
        />

        <aside>
          <h2 className="text-[1.15rem]">In this course</h2>
          <ol className="mt-3 max-h-[560px] overflow-y-auto rounded-card bg-surface shadow-hairline">
            {all.slice(0, 16).map((l, i) => (
              <li key={l.n}>
                <Link
                  href={`/learn/${slug}/${l.n}`}
                  aria-current={l.n === current.n ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-3 px-4 py-3 text-[0.88rem] transition-colors",
                    i > 0 && "border-t border-line",
                    l.n === current.n
                      ? "bg-lime-soft font-medium text-pill-ink"
                      : "text-ink-soft hover:bg-muted",
                  )}
                >
                  <span className="w-5 shrink-0 font-mono tabular-nums">{l.n}</span>
                  <span className="min-w-0 flex-1 truncate">{l.title}</span>
                  <span className="shrink-0 font-mono text-[0.78rem] tabular-nums">
                    {l.minutes}m
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
