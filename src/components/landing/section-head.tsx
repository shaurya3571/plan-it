import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { Heading } from "@/content/landing";

/** Lime pill eyebrow — used for section eyebrows and the hero badge. */
export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-lime-soft px-3.5 py-[7px] text-[0.78rem] font-medium text-pill-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** "Courses learners are <em>taking right now.</em>" */
export function EmHeading({
  as: Tag = "h2",
  title,
  id,
  className,
  emClassName = "text-moss",
}: {
  as?: "h1" | "h2";
  title: Heading;
  id?: string;
  className?: string;
  /** moss is unreadable on the dark CTA sky — pass text-lime there */
  emClassName?: string;
}) {
  return (
    <Tag id={id} className={className}>
      {title.lead} <em className={cn("italic", emClassName)}>{title.em}</em>
    </Tag>
  );
}

export function SectionHead({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: Heading;
  id?: string;
}) {
  return (
    <Reveal className="flex flex-col items-center gap-[18px] text-center">
      <Pill>{eyebrow}</Pill>
      <EmHeading title={title} id={id} />
    </Reveal>
  );
}

/** Feature card: mock on top, copy pinned to the bottom. */
export function FeatureCard({
  title,
  body,
  children,
  className,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RevealItem
      as="article"
      className={cn(
        "flex flex-col justify-between gap-6 rounded-card bg-surface p-[26px] shadow-hairline",
        className,
      )}
    >
      <div>{children}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1.5 text-[0.92rem] text-ink-soft">{body}</p>
      </div>
    </RevealItem>
  );
}
