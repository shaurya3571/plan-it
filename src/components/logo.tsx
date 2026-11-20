import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/**
 * Mark: a day-plan sheet with a checked-off first row. Drawn in currentColor so
 * it inherits ink / on-moss depending on where it sits.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4.5" width="18" height="16.5" rx="3.5" />
      <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
      <path d="m8.5 14.5 2.25 2.25L15.5 12" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  showWord = true,
}: {
  className?: string;
  markClassName?: string;
  showWord?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-[1.15rem] leading-none font-medium tracking-[-0.02em]",
        className,
      )}
    >
      <LogoMark className={markClassName} />
      {showWord && (
        <span>
          {site.wordmark.head}
          <span className="text-moss">{site.wordmark.tail}</span>
        </span>
      )}
    </span>
  );
}
