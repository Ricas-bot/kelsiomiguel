"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK_QUERY } from "@/lib/motion";

/**
 * A line that fills as its parent scrolls through the viewport — used as a
 * timeline spine. Purely decorative (aria-hidden). Reduced motion: shown
 * full, static.
 */
export default function ScrollProgress({ className, start = "top 70%", end = "bottom 70%" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        gsap.fromTo(
          ref.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current.parentElement, start, end, scrub: true }
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return <span ref={ref} className={className} aria-hidden="true" />;
}
