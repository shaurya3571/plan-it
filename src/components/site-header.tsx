"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cta, nav } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-[18px] z-50 flex justify-center px-4">
      <div className="flex w-full max-w-[880px] flex-col rounded-[28px] bg-paper/80 shadow-float backdrop-blur-[14px]">
        <div className="flex items-center gap-3 py-1.5 pr-1.5 pl-4">
          <Link href="/" className="text-ink">
            <Logo />
          </Link>

          <nav
            aria-label="Main"
            className="ml-auto hidden gap-6 text-[0.92rem] text-ink-soft md:flex"
          >
            {nav.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-3">
            <ThemeToggle />
            <Button asChild size="pill" className="hidden sm:inline-flex">
              <Link href={cta.primary.href}>{cta.primary.label}</Link>
            </Button>
            <Button
              variant="quiet"
              size="icon-pill"
              className="md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {open && (
          <nav
            aria-label="Mobile"
            className="flex flex-col gap-1 border-t border-line px-2 pt-2 pb-3 md:hidden"
          >
            {nav.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-2.5 text-[0.95rem] text-ink-soft transition-colors hover:bg-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="pill" className="mt-1 sm:hidden">
              <Link href={cta.primary.href}>{cta.primary.label}</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
