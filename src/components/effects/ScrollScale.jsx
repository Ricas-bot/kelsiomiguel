"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK_QUERY } from "@/lib/motion";

/**
 * Media that grows into place as it enters the viewport (scrubbed):
 * starts slightly smaller with clipped corners, ends full-size.
 * The animated element is this wrapper — keep CSS transforms off it.
 */
export default function ScrollScale({ children, className, from = 0.84 }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        gsap.fromTo(
          ref.current,
          { scale: from, clipPath: "inset(6% 6% 6% 6%)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 25%", scrub: true }
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
