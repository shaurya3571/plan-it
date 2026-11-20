"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { billingToggle, plans } from "@/content/pricing";
import { cta } from "@/content/site";

export function PricingTable() {
  const [yearly, setYearly] = useState(false);
  const i = yearly ? 1 : 0;

  return (
    <div>
      <div
        role="group"
        aria-label="Billing period"
        className="mx-auto flex w-fit gap-1 rounded-full p-1 ring-line"
      >
        {[billingToggle.monthly, billingToggle.yearly].map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={i === index}
            onClick={() => setYearly(index === 1)}
            className={cn(
              "min-h-[38px] rounded-full px-4 text-[0.85rem] font-medium transition-colors",
              i === index ? "bg-lime-soft text-pill-ink" : "text-ink-soft hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-card bg-surface p-[26px]",
              plan.featured
                ? "shadow-[0_0_0_2px_var(--moss)]"
                : "shadow-hairline",
            )}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{plan.name}</h3>
              {plan.badge && (
                <span className="rounded-full bg-lime-soft px-2.5 py-1 text-[0.72rem] font-medium text-pill-ink">
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[0.92rem] text-ink-soft">{plan.blurb}</p>

            <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-[2.6rem] leading-none tracking-[-0.03em] tabular-nums">
                {plan.price[i]}
              </span>
              <span className="text-[0.9rem] text-ink-soft">{plan.period[i]}</span>
              {plan.note && (
                <span className="font-mono text-label text-ink-soft">{plan.note}</span>
              )}
            </p>

            <p className="mt-6 rounded-xl bg-lime-soft px-3.5 py-3 text-[0.88rem] text-pill-ink">
              <span className="font-medium">{plan.highlight.lead}</span>{" "}
              {plan.highlight.rest}
            </p>

            <ul className="mt-5 flex-1 space-y-2.5 text-[0.9rem] text-ink-soft">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-moss" />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.ctaDisabled ? (
              <Button size="pill" variant="quiet" className="mt-7 w-full" disabled>
                {plan.cta}
              </Button>
            ) : (
              <Button asChild size="pill" className="mt-7 w-full">
                <Link href={cta.primary.href}>{plan.cta}</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
