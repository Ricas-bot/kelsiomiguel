"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { duration as d, gsapEase, MOTION_OK_QUERY, stagger as st } from "@/lib/motion";
import { whenNear } from "@/lib/whenNear";

/**
 * Scroll-triggered reveal primitive (GSAP + ScrollTrigger).
 *
 * Variants
 *  - "fade-up" : element (or its direct children when `stagger` is set) rises in.
 *  - "lines"   : text is split into masked lines that slide up (SplitText).
 *  - "words"   : text is split into masked words — for short, punchy titles.
 *  - "clip"    : media wipes in from the bottom via clip-path (image reveal).
 *
 * Performance: setup is deferred until the element nears the viewport
 * (whenNear), so below-the-fold splits don't block the main thread at load.
 *
 * Accessibility: SplitText labels the original element only when it is a
 * heading (aria-label is valid there); on paragraphs the split lines keep
 * whole words, so no label is added (aria-label on <p> is not allowed).
 *
 * Reduced motion: animations are registered inside gsap.matchMedia with
 * `prefers-reduced-motion: no-preference`; users who opt out see the final
 * state. Content is server-rendered visible; nothing depends on JS to read.
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
      if (!el) return undefined;
      const mm = gsap.matchMedia();

      const setup = () =>
        mm.add(MOTION_OK_QUERY, () => {
          const scrollTrigger = { trigger: el, start, once: true };

          if (variant === "lines" || variant === "words") {
            const type = variant === "lines" ? "lines" : "words,lines";
            const target = variant === "lines" ? "lines" : "words";

            const split = SplitText.create(el, {
              type,
              mask: target,
              wordsClass: "rv-word", // mask becomes .rv-word-mask (utilities.css)
              autoSplit: true,
              aria: /^H[1-6]$/.test(el.tagName) ? "auto" : "none",
              onSplit: (self) =>
                gsap.from(self[target], {
                  // words start lower: their mask has extra room for accents
                  yPercent: variant === "words" ? 135 : 110,
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
            return undefined;
          }

          gsap.from(stagger ? el.children : el, {
            y: 40,
            autoAlpha: 0,
            duration: d.slow,
            stagger: stagger || 0,
            delay,
            scrollTrigger
          });
          return undefined;
        });

      const stop = whenNear(el, setup);
      return () => {
        stop();
        mm.revert();
      };
    },
    { scope: ref, dependencies: [variant, delay, stagger, start] }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
