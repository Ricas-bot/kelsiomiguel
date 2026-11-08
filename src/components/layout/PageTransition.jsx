import { ViewTransition } from "react";

/**
 * Cinematic route transition using React's <ViewTransition> + the browser
 * View Transitions API (styles in src/styles/transitions.css).
 *
 * - Wrap each page's content (not the layout: layouts persist, so enter/exit
 *   never fire there).
 * - Non-blocking: the navigation itself is not delayed; the browser animates
 *   snapshots and pointer events pass through to the live page.
 * - No support → normal navigation, no animation.
 * - Reduced motion → plain short crossfade (see transitions.css).
 */
export default function PageTransition({ children }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
