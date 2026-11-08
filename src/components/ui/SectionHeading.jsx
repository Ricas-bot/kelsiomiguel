import Reveal from "@/components/effects/Reveal";
import { cn, pad } from "@/lib/utils";
import styles from "./SectionHeading.module.css";

/**
 * Editorial section opener: numbered mono label + rule, large display title
 * and an optional short aside. Server Component; only the title reveal
 * hydrates.
 *
 * @param {number}  index    Section number (rendered as 01, 02…)
 * @param {string}  label    Mono eyebrow, e.g. "SELECTED WORK"
 * @param {node}    title    Main heading content
 * @param {node}    [aside]  Short supporting text aligned to the title baseline
 * @param {string}  [count]  Optional superscript counter, e.g. "(04)"
 * @param {string}  [as]     Heading level, defaults to "h2"
 * @param {string}  [id]     id for the heading (use with aria-labelledby)
 */
export default function SectionHeading({ index, label, title, aside, count, as = "h2", id, className }) {
  return (
    <div className={cn(styles.root, className)}>
      <SectionLabel index={index} label={label} />
      <div className={styles.body}>
        <Reveal as={as} id={id} variant="words" className={styles.title}>
          {title}
        </Reveal>
        {count && (
          <span className={styles.count} aria-hidden="true">
            {count}
          </span>
        )}
        {aside && <p className={styles.aside}>{aside}</p>}
      </div>
    </div>
  );
}

/**
 * Label-only variant (numbered mono eyebrow + rule) for sections whose title
 * is composed bespoke. `tone="inverse"` is for sections on the lime surface.
 */
export function SectionLabel({ index, label, tone = "default", className }) {
  return (
    <div className={cn(styles.label, tone === "inverse" && styles.inverse, className)}>
      {index !== undefined && <span className={styles.index}>{pad(index)}</span>}
      <span>{label}</span>
    </div>
  );
}
