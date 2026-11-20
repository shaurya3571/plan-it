"use client";

import { useState } from "react";
import { Check, Play, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { lessonSample } from "@/content/lesson";
import { formatClock } from "@/lib/plan";

const TABS = ["Video", "Article", "Quiz"] as const;

export type LessonNoteBlock = { heading: string; body: string };
export type LessonQuiz = {
  question: string;
  /** quizzes.explanation is nullable, so the panel must cope without one */
  explanation: string | null;
  replayAtSeconds: number | null;
  options: { text: string; isCorrect: boolean }[];
};

export function LessonPanel({
  youtubeId,
  noteBlocks = [],
  quiz: generated = null,
}: {
  youtubeId: string;
  noteBlocks?: LessonNoteBlock[];
  quiz?: LessonQuiz | null;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Video");
  const [picked, setPicked] = useState<number | null>(null);

  // A seeded course has no generated notes or quiz, so the sample stands in
  // rather than leaving the Article and Quiz tabs empty.
  const article: readonly LessonNoteBlock[] =
    noteBlocks.length > 0 ? noteBlocks : lessonSample.article;
  const quiz: LessonQuiz =
    generated ?? {
      question: lessonSample.quiz.question,
      explanation: lessonSample.quiz.explanation,
      replayAtSeconds: null,
      options: lessonSample.quiz.options.map((option) => ({
        text: option.text,
        isCorrect: option.correct,
      })),
    };
  const replayAt =
    quiz.replayAtSeconds === null
      ? lessonSample.quiz.replayAt
      : formatClock(quiz.replayAtSeconds);

  const answered = picked !== null;
  const correct = answered && quiz.options[picked]!.isCorrect;

  return (
    <div>
      <div role="tablist" aria-label="Lesson format" className="inline-flex gap-1 rounded-full p-1 ring-line">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "min-h-[38px] rounded-full px-4 text-[0.85rem] font-medium transition-colors",
              tab === t ? "bg-lime-soft text-pill-ink" : "text-ink-soft hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "Video" && (
          <div className="aspect-video overflow-hidden rounded-card bg-night shadow-hairline">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title="Lesson video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        )}

        {tab === "Article" && (
          <article className="rounded-card bg-surface p-[26px] shadow-hairline">
            {article.map((block) => (
              <section key={block.heading} className="mt-6 first:mt-0">
                <h3 className="text-[1.15rem] font-medium">{block.heading}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">
                  {block.body}
                </p>
              </section>
            ))}
          </article>
        )}

        {tab === "Quiz" && (
          <div className="rounded-card bg-surface p-[26px] shadow-hairline">
            <p className="text-[1.05rem] font-medium">{quiz.question}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {quiz.options.map((option, i) => {
                const chosen = picked === i;
                return (
                  <li key={option.text}>
                    <button
                      type="button"
                      onClick={() => setPicked(i)}
                      aria-pressed={chosen}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-3 text-left text-[0.92rem] transition-colors",
                        !chosen && "ring-line hover:bg-muted",
                        chosen && option.isCorrect && "bg-ok-bg text-ok-fg",
                        chosen && !option.isCorrect && "bg-err-bg text-err-fg",
                      )}
                    >
                      {chosen &&
                        (option.isCorrect ? (
                          <Check className="size-4 shrink-0" />
                        ) : (
                          <X className="size-4 shrink-0" />
                        ))}
                      {option.text}
                    </button>
                  </li>
                );
              })}
            </ul>

            {answered && !correct && (
              <button
                type="button"
                onClick={() => setTab("Video")}
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-moss px-3.5 text-[0.88rem] font-medium text-on-moss"
              >
                <RotateCcw className="size-3.5" />
                Replay {replayAt} that explains it
              </button>
            )}
            {answered && correct && quiz.explanation && (
              <p className="mt-4 text-[0.92rem] text-ink-soft">{quiz.explanation}</p>
            )}
          </div>
        )}
      </div>

      <section className="mt-6">
        <h2 className="text-[1.25rem]">Your notes</h2>
        <ul className="mt-3 flex flex-col gap-2 text-[0.92rem]">
          {lessonSample.notes.map((note) => (
            <li key={note.at} className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setTab("Video")}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 font-mono text-[0.78rem] font-medium text-moss tabular-nums ring-line transition-colors hover:bg-muted"
              >
                <Play className="size-3 fill-current" />
                {note.at}
              </button>
              <span className="min-w-0 text-ink-soft">{note.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
