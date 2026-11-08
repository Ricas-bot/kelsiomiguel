"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "@/lib/motion";

/** Current Lenis instance (null when smooth scroll is off). */
let lenisInstance = null;
export const getLenis = () => lenisInstance;

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger and
 * Lenis share one frame loop.
 *
 * Only enabled for fine pointers (mouse/trackpad) without reduced motion:
 * touch devices keep native momentum scrolling. Lenis keeps the page's
 * native scroll position, so keyboard scrolling, find-in-page, anchors and
 * `position: sticky` keep working. `autoToggle` pauses it whenever the page
 * is locked with `overflow: hidden` (mobile menu, terminal).
 * Scrollable regions opt out with `data-lenis-prevent`.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const canSmooth =
      window.matchMedia(FINE_POINTER_QUERY).matches && !window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (!canSmooth) return undefined;

    const lenis = new Lenis({ autoToggle: true, lerp: 0.11, wheelMultiplier: 1 });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // New route: page height changed and Next reset the scroll position.
  useEffect(() => {
    lenisInstance?.resize();
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
