"use client";

import Link from "next/link";
import { getLenis } from "@/components/effects/SmoothScroll";

/**
 * Click handler for links to a section of the current page (`/pt#work`).
 * With Lenis active: smooth scroll via Lenis (forced, so it also works while
 * the mobile menu has the page locked) and the URL hash is updated.
 * Without Lenis: does nothing, so Next.js scrolls natively (CSS
 * scroll-behavior handles smoothness and reduced motion).
 */
export function handleSectionClick(event) {
  const lenis = getLenis();
  const anchor = event.currentTarget;
  if (!lenis || !anchor?.href) return;

  const url = new URL(anchor.href);
  if (url.pathname !== window.location.pathname || !url.hash) return;

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;

  event.preventDefault();
  history.pushState(null, "", url.hash);
  requestAnimationFrame(() => {
    lenis.scrollTo(target, {
      force: true,
      onComplete: () => target.focus?.({ preventScroll: true })
    });
  });
}

/** next/link that scrolls smoothly to in-page sections. */
export default function SectionLink({ onClick, ...props }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        handleSectionClick(event);
        onClick?.(event);
      }}
    />
  );
}
