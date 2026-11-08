"use client";

import { REDUCED_MOTION_QUERY } from "@/lib/motion";
import { useMediaQuery } from "./useMediaQuery";

/**
 * True when the user asked the OS to minimise motion.
 * Server/first render assumes `false`; GSAP animations should prefer
 * `gsap.matchMedia()` (see Reveal) so they never start before this is known.
 */
export function useReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY, false);
}
