"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Pulls its child towards the pointer while hovered and springs back on
 * leave. Wraps the child in its own element so the child can keep its own
 * (CSS / Framer) animations. Disabled on touch and with reduced motion.
 *
 * @param {number} strength  0–1, share of the pointer offset applied.
 */
export default function Magnetic({ children, strength = 0.3, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!window.matchMedia(FINE_POINTER_QUERY).matches || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return undefined;
    }

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    let rect = null;

    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      rect = null;
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);

  return (
    <span ref={ref} className={cn("magnetic", className)}>
      {children}
    </span>
  );
}
