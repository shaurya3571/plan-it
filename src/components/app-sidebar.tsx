"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Route, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNav } from "@/content/shell";

const icons = { home: Home, plus: Plus, users: Users, route: Route };

export function AppSidebar({ name, initials }: { name: string; initials: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-line bg-sidebar pt-[100px] pb-6 lg:flex">
      <nav aria-label="App" className="flex flex-col gap-1 px-3">
        {sidebarNav.map((item) => {
          const Icon = icons[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-[0.92rem] transition-colors",
                active
                  ? "bg-lime-soft font-medium text-pill-ink"
                  : "text-ink-soft hover:bg-muted hover:text-ink",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3">
        <div className="flex items-center gap-2.5 px-1.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime-soft font-mono text-[0.7rem] text-pill-ink">
            {initials}
          </span>
          <span className="truncate text-[0.88rem] text-ink">{name}</span>
        </div>
      </div>
    </aside>
  );
}
