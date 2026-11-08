"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "@/lib/motion";
import styles from "./CustomCursor.module.css";

const TEXT_INPUT = "input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable=true]";
const INTERACTIVE = "a, button, [role=button], label, summary";

/**
 * Desktop-only custom cursor (fine pointer + hover). Touch devices keep the
 * native cursor; nothing renders on the server or the first client render.
 *
 * States (set with `data-cursor` on any element, or inferred):
 *  - default  — small dot + trailing ring
 *  - link     — links and buttons: ring grows, dot hides
 *  - project  — large filled disc with a label (`data-cursor-label`)
 *  - hidden   — text inputs: native caret is shown instead
 * Reduced motion: the cursor follows the pointer without lag.
 */
export default function CustomCursor() {
  const enabled = useMediaQuery(FINE_POINTER_QUERY, false);
  return enabled ? <Cursor /> : null;
}

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [state, setState] = useState({ type: "default", label: "", visible: false, pressed: false });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot, "x", { duration: reduce ? 0 : 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: reduce ? 0 : 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: reduce ? 0 : 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: reduce ? 0 : 0.45, ease: "power3.out" });

    let current = "default|";
    const update = (next) => {
      const key = `${next.type}|${next.label}`;
      if (key === current) return;
      current = key;
      setState((s) => ({ ...s, ...next }));
    };

    const resolve = (target) => {
      if (!(target instanceof Element)) return { type: "default", label: "" };
      const explicit = target.closest("[data-cursor]");
      if (explicit) return { type: explicit.dataset.cursor, label: explicit.dataset.cursorLabel || "" };
      if (target.closest(TEXT_INPUT)) return { type: "hidden", label: "" };
      if (target.closest(INTERACTIVE)) return { type: "link", label: "" };
      return { type: "default", label: "" };
    };

    const onMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      setState((s) => (s.visible ? s : { ...s, visible: true }));
    };
    const onOver = (e) => update(resolve(e.target));
    const onDown = () => setState((s) => ({ ...s, pressed: true }));
    const onUp = () => setState((s) => ({ ...s, pressed: false }));
    const onLeave = () => setState((s) => ({ ...s, visible: false }));

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      className={styles.cursor}
      data-state={state.type}
      data-visible={state.visible}
      data-pressed={state.pressed}
      aria-hidden="true"
    >
      {/* GSAP owns the wrapper's transform (position); CSS owns the inner disc's
          scale. GSAP writes `scale: none` inline on elements it transforms, so
          the two must never be the same element. */}
      <div ref={ringRef} className={styles.ringPos}>
        <div className={styles.ring}>
          <span className={styles.label}>{state.label}</span>
        </div>
      </div>
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
