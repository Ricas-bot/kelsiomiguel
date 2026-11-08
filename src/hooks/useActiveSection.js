"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the middle band of the
 * viewport (IntersectionObserver — no scroll listeners). Pass an empty
 * array to disable (e.g. on pages without those sections).
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    const elements = key
      .split("|")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
        else if (window.scrollY < window.innerHeight * 0.5) setActive(null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  // Derived, not stored: pages without the sections always report null.
  return key ? active : null;
}
