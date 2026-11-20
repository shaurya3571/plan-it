import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmHeading, Pill } from "@/components/landing/section-head";
import { PricingTable } from "@/components/pricing-table";
import { faq, pricingHead } from "@/content/pricing";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="px-6 pt-[160px] pb-[110px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center gap-[18px] text-center">
          <Pill>{pricingHead.eyebrow}</Pill>
          <EmHeading title={pricingHead.title} />
          <p className="max-w-[640px] text-[1.02rem] text-ink-soft">
            {pricingHead.intro}
          </p>
        </div>

        <div className="mt-12">
          <PricingTable />
        </div>

        <div className="mx-auto mt-[110px] max-w-[760px]">
          <h2 className="text-center">{faq.heading}</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faq.items.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-line">
                <AccordionTrigger className="text-left text-[1rem] font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[0.95rem] leading-relaxed text-ink-soft">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
