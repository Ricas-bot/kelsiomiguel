"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK_QUERY } from "@/lib/motion";

/**
 * Counts up the numeric part of a value ("4+", "10+", "02") when it scrolls
 * into view. The final value is server-rendered, so it's correct without JS
 * and for screen readers (the animated text is aria-hidden; a visually
 * hidden copy holds the real value).
 */
export default function Counter({ value, className }) {
  const ref = useRef(null);
  const match = /^(\d+)(.*)$/.exec(value);

  useGSAP(
    () => {
      if (!match) return undefined;
      const [, digits, suffix] = match;
      const target = Number(digits);
      const width = digits.length;
      const el = ref.current;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK_QUERY, () => {
        const state = { n: 0 };
        const render = () => {
          el.textContent = `${String(Math.round(state.n)).padStart(width, "0")}${suffix}`;
        };
        render();
        gsap.to(state, {
          n: target,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 90%", once: true }
        });
        return () => {
          el.textContent = value;
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] }
  );

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
