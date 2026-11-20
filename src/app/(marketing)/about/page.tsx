import type { Metadata } from "next";
import Link from "next/link";
import { Pill } from "@/components/landing/section-head";
import { Button } from "@/components/ui/button";
import { about } from "@/content/about";
import { cta, site } from "@/content/site";

export const metadata: Metadata = { title: "About" };

/** Turns the contact email and the final CTA phrase into real links. */
function withLinks(text: string) {
  const parts = text.split(
    new RegExp(`(${site.email}|build your first course)`, "g"),
  );
  return parts.map((part, i) => {
    if (part === site.email) {
      return (
        <a
          key={i}
          href={`mailto:${site.email}`}
          className="text-moss underline underline-offset-4"
        >
          {part}
        </a>
      );
    }
    if (part === "build your first course") {
      return (
        <Link
          key={i}
          href={cta.footer.href}
          className="text-moss underline underline-offset-4"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

export default function AboutPage() {
  return (
    <div className="px-6 pt-[160px] pb-[110px]">
      <article className="mx-auto max-w-[760px]">
        <Pill>{about.eyebrow}</Pill>
        <h1 className="mt-[18px]">
          plan-it<span className="text-moss">.</span>
        </h1>
        <p className="mt-6 text-[1.1rem] leading-relaxed text-ink-soft">
          {about.lede}
        </p>

        {about.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="text-[1.6rem]">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p
                key={i}
                className="mt-3 text-[1rem] leading-relaxed text-ink-soft"
              >
                {withLinks(paragraph)}
              </p>
            ))}
          </section>
        ))}

        <Button asChild size="pill" className="mt-12">
          <Link href={cta.footer.href}>{cta.footer.label}</Link>
        </Button>
      </article>
    </div>
  );
}
