"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/motion";

/**
 * Hero choreography (GSAP). Wraps the server-rendered hero and animates it
 * through data attributes, so the markup stays a Server Component.
 *
 * First load (html[data-intro="pending"], set by an inline script before
 * paint) plays the full sequence, ≈2.2s:
 *   1. name rises letter by letter       (0.00s)
 *   2. professional title + statement    (0.55s)
 *   3. orbital visual draws in           (0.70s)
 *   4. navigation + meta fade in         (1.05s)
 *   5. CTAs, then the scroll cue starts  (1.35s → 1.70s)
 * Returning to home via client navigation: only the name animates.
 *
 * Scroll storytelling (desktop): as the hero scrolls away, the two name
 * lines drift apart, the visual rotates/scales (parallax) and the copy
 * lifts out.
 *
 * Reduced motion: no animation; the intro flag is cleared immediately.
 */
export default function HeroMotion({ children, className }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      const html = document.documentElement;
      const isIntro = html.dataset.intro === "pending";
      const q = (sel) => root.querySelectorAll(sel);
      const nav = document.querySelectorAll("header [data-intro-el]");
      const finish = () => {
        delete html.dataset.intro;
        root.querySelector("[data-scroll-cue]")?.setAttribute("data-active", "");
      };

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set([...q("[data-intro-el]"), ...nav], { clearProps: "all" });
        finish();
      });

      mm.add(MOTION_OK_QUERY, () => {
        const name = root.querySelector("[data-hero-name]");
        const split = SplitText.create(name, { type: "chars", mask: "chars", charsClass: "char" });
        const line1 = name.querySelectorAll('[data-line="1"] .char');
        const line2 = name.querySelectorAll('[data-line="2"] .char');

        // Everything pre-hidden by CSS becomes visible; children animate in.
        gsap.set(name, { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });

        tl.from(line1, { yPercent: 115, duration: 1.1, stagger: 0.035 }, 0).from(
          line2,
          { yPercent: 115, duration: 1.1, stagger: 0.035 },
          0.12
        );

        if (isIntro) {
          tl.fromTo(q("[data-hero-copy] > p[data-intro-el]"), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.09 }, 0.55)
            .fromTo(q("[data-hero-visual]"), { scale: 0.86, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.6 }, 0.7)
            .from(q("[data-draw]"), { strokeDashoffset: 1, duration: 1.8, stagger: 0.08, ease: "power3.inOut" }, 0.7)
            .from(q("[data-node]"), { autoAlpha: 0, duration: 0.6, stagger: 0.04 }, 1.2)
            .fromTo(nav, { y: -16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, clearProps: "transform,opacity,visibility" }, 1.05)
            .fromTo(q("[data-hero-meta]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 1.1)
            .fromTo(q("[data-hero-actions]"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.35)
            .fromTo(q("[data-scroll-cue]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.7);
        } else {
          finish();
        }

        // CSS pre-hide no longer needed: GSAP now owns the start states.
        delete html.dataset.intro;

        return () => split.revert();
      });

      // Scroll-out storytelling — desktop only, motion allowed.
      mm.add(`${MOTION_OK_QUERY} and (min-width: 768px)`, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true }
          })
          .to(q('[data-hero-name] [data-line="1"]'), { xPercent: -6 }, 0)
          .to(q('[data-hero-name] [data-line="2"]'), { xPercent: 9 }, 0)
          .to(q("[data-hero-visual-scroll]"), { yPercent: 22, rotate: 24, scale: 1.12 }, 0)
          .to(q("[data-hero-copy]"), { y: -60, autoAlpha: 0 }, 0)
          .to(q("[data-scroll-cue]"), { autoAlpha: 0 }, 0);
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
