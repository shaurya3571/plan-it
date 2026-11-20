import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmHeading, Pill } from "@/components/landing/section-head";
import { getLegalPage, legalPages } from "@/content/legal";

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  return { title: page?.metaTitle ?? "Not found" };
}

export default async function LegalPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <div className="px-6 pt-[160px] pb-[110px]">
      <article className="mx-auto max-w-[760px]">
        <Pill>{page.eyebrow}</Pill>
        <p className="mt-5 font-mono text-label tracking-[0.07em] text-ink-soft uppercase">
          Last updated {page.lastUpdated}
        </p>
        <EmHeading as="h1" title={page.title} className="mt-2" />
        <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
          {page.intro}
        </p>

        {page.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-[1.4rem]">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
