import { cn, pad } from "@/lib/utils";
import styles from "./ProjectArt.module.css";

const PATTERNS = ["orbits", "grid", "bars", "dots", "lines"];

/**
 * Typographic composition standing in for project imagery until real,
 * publishable screenshots exist (Phase 6). Each project gets its own
 * pattern + tone by index so the list never looks templated.
 * Decorative: the project name is always present as real text elsewhere.
 */
export default function ProjectArt({ project, index, size = "md", className }) {
  const pattern = PATTERNS[index % PATTERNS.length];

  return (
    <div
      className={cn(styles.art, styles[pattern], styles[size], className)}
      data-tone={index % PATTERNS.length}
      aria-hidden="true"
    >
      <span className={styles.pattern} />
      {pattern === "orbits" && (
        <svg className={styles.orbitsSvg} viewBox="0 0 400 240" fill="none">
          <ellipse cx="200" cy="120" rx="170" ry="62" />
          <ellipse cx="200" cy="120" rx="120" ry="44" transform="rotate(-14 200 120)" />
          <circle cx="200" cy="120" r="4" />
        </svg>
      )}
      <span className={styles.meta}>
        <span>{pad(index + 1)}</span>
        <span>{project.year}</span>
      </span>
      <span className={styles.word}>{project.art}</span>
    </div>
  );
}
