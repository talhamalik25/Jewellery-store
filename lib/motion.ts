import type { Variants } from "framer-motion";

const editorialEase = [0.22, 1, 0.36, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: editorialEase } },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
};

export const reducedFadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "linear" } },
};

export const reducedStaggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
};

/** Pair with Framer Motion's useReducedMotion() in client components. */
export function getMotionVariants(reducedMotion: boolean) {
  return {
    fadeUp: reducedMotion ? reducedFadeUpVariants : fadeUpVariants,
    stagger: reducedMotion ? reducedStaggerVariants : staggerVariants,
  };
}

