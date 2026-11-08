"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Scroll-driven focus: the child marked [data-focus-item] crossing the
 * reading line gets `data-active`; CSS dims the rest. The list only dims
 * once this has mounted (`data-focus-ready`), so without JS everything is
 * fully legible. Opacity only — no movement — so it stays on with reduced
 * motion.
 */
export default function FocusList({ as: Tag = "ol", className, children, line = "55%" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      const items = [...root.querySelectorAll("[data-focus-item]")];
      root.setAttribute("data-focus-ready", "");

      const triggers = items.map((item) =>
        ScrollTrigger.create({
          trigger: item,
          start: `top ${line}`,
          end: `bottom ${line}`,
          onToggle: (self) => item.toggleAttribute("data-active", self.isActive)
        })
      );

      return () => {
        triggers.forEach((t) => t.kill());
        root.removeAttribute("data-focus-ready");
        items.forEach((i) => i.removeAttribute("data-active"));
      };
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
