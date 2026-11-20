import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemedLandscape } from "@/components/landscape-scene";
import { EmHeading, Pill } from "@/components/landing/section-head";
import { Reveal } from "@/components/motion/reveal";
import { finalCta } from "@/content/landing";
import { cta } from "@/content/site";

export function FinalCta() {
  return (
    <section
      aria-label="Start today"
      className="relative flex h-[620px] items-center overflow-hidden"
    >
      <ThemedLandscape day="dusk" />

      <Reveal className="relative z-10 mx-auto flex max-w-[860px] flex-col items-center gap-[22px] px-6 pb-24 text-center">
        <Pill>{finalCta.eyebrow}</Pill>
        <EmHeading title={finalCta.title} className="text-white" emClassName="text-lime" />
        <p className="max-w-[560px] text-[1.05rem] text-white/85">{finalCta.body}</p>

        <div className="mt-1.5 flex flex-wrap justify-center gap-2.5">
          <Button asChild size="pill">
            <Link href={cta.primary.href}>{cta.primary.label}</Link>
          </Button>
          <Button
            asChild
            variant="quiet"
            size="pill"
            className="bg-white/15 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.4)] backdrop-blur-[10px] hover:bg-white/25 hover:text-white"
          >
            <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
