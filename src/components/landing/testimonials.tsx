import { SectionHead } from "@/components/landing/section-head";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { testimonials, testimonialsHead } from "@/content/landing";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function Testimonials() {
  return (
    <section aria-labelledby="learners-title" className="px-6 py-[110px]">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead {...testimonialsHead} id="learners-title" />

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <RevealItem
              as="figure"
              key={i}
              className="flex flex-col rounded-card bg-surface p-[26px] shadow-hairline"
            >
              <span aria-hidden="true" className="font-display text-[2.5rem] leading-none text-lime">
                &ldquo;
              </span>
              <blockquote className="mt-1 flex-1 text-[0.98rem] leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime-soft font-mono text-[0.78rem] text-pill-ink">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.9rem] font-medium text-ink">
                    {t.name}
                  </span>
                  <span className="block truncate text-[0.82rem] text-ink-soft">
                    {t.role}
                  </span>
                </span>
              </figcaption>
              <p className="mt-3 font-mono text-[0.72rem] text-moss">
                {t.finished}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
