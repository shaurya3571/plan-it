import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemedLandscape } from "@/components/landscape-scene";
import { EmHeading, Pill } from "@/components/landing/section-head";
import { AppPreview } from "@/components/landing/app-preview";
import { TourPanel } from "@/components/landing/tour-panel";
import { Parallax } from "@/components/motion/parallax";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { hero } from "@/content/landing";
import { cta } from "@/content/site";

const FLOAT_SQUARES = [
  "top-[700px] left-[5%]",
  "top-[700px] left-[calc(5%+52px)] [animation-delay:-2s]",
  "top-[752px] left-[calc(5%+52px)] [animation-delay:-4s]",
  "top-[640px] right-[6%] [animation-delay:-1s]",
  "top-[692px] right-[6%] [animation-delay:-3s]",
];

export function Hero() {
  return (
    <>
      <section aria-label="Intro" className="relative h-[980px] overflow-hidden">
        <Parallax className="absolute inset-0">
          <ThemedLandscape day="sunrise" />
        </Parallax>

        {FLOAT_SQUARES.map((position) => (
          <span key={position} aria-hidden="true" className={`float-square ${position}`} />
        ))}

        {/* Above the fold, so this group fires on mount rather than on scroll. */}
        <RevealGroup className="relative z-10 mx-auto flex max-w-[980px] flex-col items-center gap-[22px] px-6 pt-[178px] text-center">
          <RevealItem>
            <Pill>
              <Sparkles className="size-3.5 text-moss" />
              {hero.badge}
            </Pill>
          </RevealItem>

          <RevealItem>
            <EmHeading as="h1" title={hero.title} />
          </RevealItem>

          <RevealItem>
            <p className="max-w-[560px] text-[1.1rem] text-ink-soft">{hero.subtitle}</p>
          </RevealItem>

          <RevealItem className="mt-1.5">
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button asChild size="pill">
                <Link href={cta.primary.href}>{cta.primary.label}</Link>
              </Button>
              <Button asChild variant="quiet" size="pill" className="bg-glass">
                <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
              </Button>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* The product tour panel tilts up out of the landscape. */}
      <section aria-label="Product tour" className="relative z-20 -mt-[230px] px-6">
        <TourPanel className="mx-auto aspect-[1600/1038] w-[min(100%,calc((100vh-140px)*1600/1038))] max-w-[1200px] overflow-hidden rounded-panel bg-tour shadow-[0_0_0_6px_var(--surface),0_40px_80px_-30px_rgba(22,49,92,0.5)]">
          <AppPreview />
        </TourPanel>
      </section>
    </>
  );
}
