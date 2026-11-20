import { Play, Share2, Users } from "lucide-react";
import { FeatureCard, SectionHead } from "@/components/landing/section-head";
import { RevealGroup } from "@/components/motion/reveal";
import { NotesMock, PaceMock } from "@/components/landing/interactive-mocks";
import { features, featuresHead } from "@/content/landing";

function StatusPill({ known }: { known: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] text-[0.78rem] font-medium whitespace-nowrap ${
        known ? "bg-ok-bg text-ok-fg" : "bg-warn-bg text-warn-fg"
      }`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {known ? "Known" : "To learn"}
    </span>
  );
}

function PlacementMock() {
  const f = features.placement;
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-[18px]">
        <span className="font-display text-[2rem] text-ink-soft tabular-nums line-through opacity-60">
          {f.fullLength}
        </span>
        <span className="font-display text-[clamp(4rem,9vw,7rem)] leading-[0.9] tracking-[-0.04em] text-moss tabular-nums">
          {f.yourLength}
        </span>
      </div>
      <ul className="mt-7 text-[0.95rem]">
        {f.lessons.map((lesson) => (
          <li
            key={lesson.title}
            className="flex justify-between gap-3 border-t border-line py-3 text-ink-soft"
          >
            <span className={lesson.known ? "line-through" : undefined}>
              {lesson.title}
            </span>
            <StatusPill known={lesson.known} />
          </li>
        ))}
      </ul>
    </>
  );
}

function QuizMock() {
  const f = features.quiz;
  return (
    <div className="flex flex-col gap-2.5 text-[0.88rem]">
      <p className="font-medium">{f.question}</p>
      <span className="rounded-xl bg-err-bg px-3 py-2 text-err-fg">
        {f.wrongAnswer}
      </span>
      <span className="inline-flex h-9 items-center gap-1.5 self-start rounded-full bg-moss px-3.5 font-medium text-on-moss">
        <Play className="size-3 fill-current" />
        {f.replayLabel}
      </span>
    </div>
  );
}

function PasteMock() {
  const f = features.paste;
  return (
    <>
      <div className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3.5 font-mono text-[0.88rem] ring-line">
        <span className="text-moss">›</span>
        <span className="min-w-0 flex-1 truncate">{f.url}</span>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {f.chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-lime-soft px-3 py-[7px] font-mono text-label tracking-[0.07em] text-pill-ink uppercase"
          >
            {chip}
          </span>
        ))}
      </div>
    </>
  );
}

function RoadmapMock() {
  const f = features.roadmap;
  return (
    <>
      <ol className="flex flex-wrap items-center gap-2" aria-label="Example roadmap stages">
        {f.stages.map((stage, i) => (
          <li key={stage} className="inline-flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-[7px] text-[0.85rem] font-medium ${
                i + 1 === f.activeStage
                  ? "bg-moss text-on-moss"
                  : "bg-lime-soft text-pill-ink"
              }`}
            >
              <span className="tabular-nums opacity-70">{i + 1}</span>
              {stage}
            </span>
            {i < f.stages.length - 1 && (
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
          {f.learners}
        </span>
        <span className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full px-4 font-medium text-ink ring-line">
          <Share2 className="size-4" />
          Share
        </span>
        <span className="inline-flex h-10 items-center rounded-full bg-moss px-4 font-medium text-on-moss">
          {f.enrollLabel}
        </span>
      </div>
    </>
  );
}

function PinnedNotesMock() {
  const f = features.pinned;
  return (
    <ul className="flex flex-col gap-2 text-[0.88rem]">
      {f.notes.map((note) => (
        <li key={note.at} className="flex items-center gap-2.5">
          <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 font-mono text-[0.78rem] font-medium text-moss tabular-nums ring-line">
            <Play className="size-3 fill-current" />
            {note.at}
          </span>
          <span className="truncate text-ink-soft">{note.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-24 px-6 py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHead {...featuresHead} id="features-title" />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <FeatureCard
            title={features.placement.title}
            body={features.placement.body}
            className="lg:col-span-2 lg:row-span-2"
          >
            <PlacementMock />
          </FeatureCard>

          <FeatureCard title={features.notes.title} body={features.notes.body}>
            <NotesMock />
          </FeatureCard>

          <FeatureCard title={features.quiz.title} body={features.quiz.body}>
            <QuizMock />
          </FeatureCard>

          <FeatureCard
            title={features.paste.title}
            body={features.paste.body}
            className="lg:col-span-2"
          >
            <PasteMock />
          </FeatureCard>

          <FeatureCard title={features.pace.title} body={features.pace.body}>
            <PaceMock />
          </FeatureCard>

          <FeatureCard
            title={features.roadmap.title}
            body={features.roadmap.body}
            className="lg:col-span-2"
          >
            <RoadmapMock />
          </FeatureCard>

          <FeatureCard title={features.pinned.title} body={features.pinned.body}>
            <PinnedNotesMock />
          </FeatureCard>
        </RevealGroup>
      </div>
    </section>
  );
}
