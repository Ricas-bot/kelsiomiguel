"use client";

/**
 * Runs `callback` once the element is within `margin` viewport-heights of
 * the screen. Elements already near the viewport at mount run synchronously
 * (so their start state is set before first paint, no flicker); the rest
 * wait for an IntersectionObserver. This spreads the cost of SplitText /
 * ScrollTrigger setup over the scroll instead of one long task at load.
 * Returns a cleanup function.
 */
export function whenNear(el, callback, margin = 0.6) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.top < vh * (1 + margin) && rect.bottom > -vh * margin) {
    callback();
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        callback();
      }
    },
    { rootMargin: `${margin * 100}% 0px` }
  );
  io.observe(el);
  return () => io.disconnect();
}
