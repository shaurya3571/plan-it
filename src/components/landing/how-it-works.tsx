import { SectionHead } from "@/components/landing/section-head";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { howHead, steps } from "@/content/landing";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="scroll-mt-24 bg-tour px-6 py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHead {...howHead} id="how-title" />

        <RevealGroup as="ol" className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <RevealItem
              as="li"
              key={step.title}
              className="rounded-card bg-surface p-[26px] shadow-hairline"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-moss font-mono text-[0.85rem] text-on-moss">
                {i + 1}
              </span>
              <h3 className="mt-5 font-medium">{step.title}</h3>
              <p className="mt-1.5 text-[0.92rem] text-ink-soft">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
