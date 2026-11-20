import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { cta, nav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-tour">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          <div className="max-w-sm">
            <Link href="/" className="text-ink">
              <Logo />
            </Link>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
              {site.description}
            </p>
            <Link
              href={cta.footer.href}
              className="mt-5 inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-moss transition-colors hover:text-moss-dark"
            >
              {cta.footer.label}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {nav.footer.map((group) => (
              <div key={group.heading}>
                <h2 className="text-[0.72rem] font-medium tracking-widest text-ink-soft uppercase">
                  {group.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.95rem] text-ink-soft transition-colors hover:text-ink hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-[0.85rem] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.name}. {site.footerNote}
          </p>
          <p>{site.creatorNote}</p>
        </div>
      </div>
    </footer>
  );
}
