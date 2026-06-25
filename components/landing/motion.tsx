"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Soft "playful" easing with a touch of overshoot.
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Fades + slides its children into place the first time they scroll into view.
 * Collapses to an instant appearance when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A glass card that lifts slightly on hover and reveals on scroll. The hover
 * lift is disabled under reduced-motion.
 */
export function MotionCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.015 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Counts up from 0 to `to` when scrolled into view. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration: 1.1, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, reduce, count]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}

/** Wraps content with a gentle, continuous floating loop. */
export function Float({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** A decorative blur orb that drifts slowly and endlessly. */
export function DriftingOrb({
  className,
  drift = [0, 30, 0],
  rise = [0, -24, 0],
  duration = 18,
}: {
  className?: string;
  drift?: number[];
  rise?: number[];
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute -z-10 rounded-full blur-3xl", className)}
      animate={reduce ? undefined : { x: drift, y: rise }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export { motion, EASE };
