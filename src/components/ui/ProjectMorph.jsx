import { ViewTransition } from "react";

/**
 * Shared-element wrapper: the same project composition on the home page and
 * on its case study carries the same view-transition name, so navigating
 * between them morphs one into the other (see styles/transitions.css).
 * Each slug must appear at most once per page.
 */
export default function ProjectMorph({ slug, children }) {
  return (
    <ViewTransition name={`project-art-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
