"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { duration as d, gsapEase, MOTION_OK_QUERY, stagger as st } from "@/lib/motion";

/**
 * Scroll-triggered reveal primitive (GSAP + ScrollTrigger).
 *
 * Variants
 *  - "fade-up" : element (or its direct children when `stagger` is set) rises in.
 *  - "lines"   : text is split into masked lines that slide up (SplitText).
 *  - "words"   : text is split into masked words — for short, punchy titles.
 *  - "clip"    : media wipes in from the bottom via clip-path (image reveal).
 *
 * Reduced motion: animations are registered inside gsap.matchMedia with
 * `prefers-reduced-motion: no-preference`, so users who opt out simply see
 * the final state — no hidden content, no transforms.
 *
 * Content is server-rendered visible; GSAP sets the start state in a layout
 * effect before first paint after hydration, so nothing depends on JS to be
 * readable.
 */
export default function Reveal({
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  stagger = 0,
  start = "top 85%",
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK_QUERY, () => {
        const scrollTrigger = { trigger: el, start, once: true };

        if (variant === "lines" || variant === "words") {
          const type = variant === "lines" ? "lines" : "words,lines";
          const target = variant === "lines" ? "lines" : "words";

          const split = SplitText.create(el, {
            type,
            mask: target,
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self[target], {
                yPercent: 110,
                duration: d.reveal,
                ease: gsapEase.outExpo,
                stagger: stagger || (variant === "lines" ? st.base : st.tight),
                delay,
                scrollTrigger
              })
          });

          return () => split.revert();
        }

        if (variant === "clip") {
          gsap.from(el, {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: d.reveal,
            ease: gsapEase.inOut,
            delay,
            scrollTrigger
          });
          return;
        }

        const targets = stagger ? el.children : el;
        gsap.from(targets, {
          y: 40,
          autoAlpha: 0,
          duration: d.slow,
          stagger: stagger || 0,
          delay,
          scrollTrigger
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [variant, delay, stagger, start] }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
