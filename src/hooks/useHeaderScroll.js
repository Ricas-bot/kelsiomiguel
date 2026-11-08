"use client";

import { useEffect, useState } from "react";

/**
 * Header scroll state, rAF-throttled:
 *  - `scrolled`: page left the very top (solid background).
 *  - `hidden`:   user is scrolling down past `hideAfter` px (header tucks away;
 *                it reappears on any upward scroll or keyboard focus).
 */
export function useHeaderScroll({ threshold = 24, hideAfter = 160, tolerance = 6 } = {}) {
  const [state, setState] = useState({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      setState((prev) => {
        const scrolled = y > threshold;
        let hidden = prev.hidden;
        if (y < hideAfter) hidden = false;
        else if (delta > tolerance) hidden = true;
        else if (delta < -tolerance) hidden = false;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });
      if (Math.abs(delta) > tolerance) lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, hideAfter, tolerance]);

  return state;
}
