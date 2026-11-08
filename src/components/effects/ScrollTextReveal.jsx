"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION_OK_QUERY } from "@/lib/motion";

/**
 * Scroll-scrubbed reading reveal: words light up from dim to full as the
 * paragraph travels through the viewport, so the sentence is "read" with the
 * scroll. Reduced motion: text is simply fully visible.
 */
export default function ScrollTextReveal({ as: Tag = "p", className, children, dim = 0.16 }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const split = SplitText.create(ref.current, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: dim },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.08,
                scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 45%", scrub: true }
              }
            )
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
