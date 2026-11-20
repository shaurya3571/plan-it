"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Backdrop drifts down as the page scrolls up, so it reads as further away.
 *
 * The gap this opens at the top of the element is always already above the
 * viewport (the backdrop lags the page by `distance/1000` of the scroll, so its
 * top edge stays negative), which is why the scene needs no extra headroom.
 */
export function Parallax({
  className,
  children,
  distance = 220,
}: {
  className?: string;
  children: React.ReactNode;
  distance?: number;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, distance]);

  return (
    <motion.div className={className} style={reduced ? undefined : { y }}>
      {children}
    </motion.div>
  );
}
