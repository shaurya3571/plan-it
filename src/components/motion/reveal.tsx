"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * Scroll reveal: content fades up 24px as it enters the viewport, once.
 *
 * `Reveal` animates on its own. `RevealGroup` animates nothing itself — it only
 * orchestrates `RevealItem` children so they land one after another.
 */

const TAGS = {
  div: motion.div,
  ol: motion.ol,
  li: motion.li,
  article: motion.article,
  figure: motion.figure,
} as const;

type Tag = keyof typeof TAGS;

type Props = {
  as?: Tag;
  className?: string;
  children: React.ReactNode;
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const group: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};

export function Reveal({ as = "div", className, children }: Props) {
  const Comp = TAGS[as];
  const reduced = useReducedMotion();

  if (reduced) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      className={className}
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </Comp>
  );
}

export function RevealGroup({
  as = "div",
  className,
  children,
  stagger = 0.08,
}: Props & { stagger?: number }) {
  const Comp = TAGS[as];
  const reduced = useReducedMotion();

  if (reduced) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      className={className}
      variants={group}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Comp>
  );
}

/** Inherits hidden/show from the enclosing RevealGroup — no viewport of its own. */
export function RevealItem({ as = "div", className, children }: Props) {
  const Comp = TAGS[as];
  const reduced = useReducedMotion();

  if (reduced) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}
