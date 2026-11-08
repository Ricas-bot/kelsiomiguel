/**
 * Motion tokens — shared by Framer Motion (React UI interactions) and GSAP
 * (scroll-driven / sequenced animation). Mirrors the CSS custom properties in
 * src/styles/tokens.css so every system moves with the same rhythm.
 *
 * Rule of thumb:
 *   - Framer Motion → component state (menus, overlays, hover, presence).
 *   - GSAP + ScrollTrigger → timelines and anything tied to scroll position.
 *   - Never animate the same element with both.
 */

/** Cubic-bezier control points (Framer Motion `ease` / CSS). */
export const easing = {
  outQuart: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1]
};

/** Equivalent GSAP ease names. */
export const gsapEase = {
  outQuart: "power4.out",
  outExpo: "expo.out",
  inOut: "power3.inOut"
};

/** Durations in seconds (Framer Motion and GSAP both use seconds). */
export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.35,
  slow: 0.7,
  reveal: 1.1
};

/** Default stagger between sibling items (seconds). */
export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14
};

/** Media query used everywhere motion must be disabled or simplified. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";

/** Fine pointer + hover = desktop-class input (custom cursor, magnetic UI). */
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/** Reusable Framer Motion variants. */
export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.outQuart } }
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: duration.base, ease: easing.outQuart } }
  }
};
