import ScrollTextReveal from "@/components/effects/ScrollTextReveal";
import Reveal from "@/components/effects/Reveal";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { pad } from "@/lib/utils";
import styles from "./Introduction.module.css";

/**
 * Introduction — the positioning statement, read word by word with the
 * scroll, then the three pillars (full-stack · LMS · systems).
 */
export default function Introduction({ t }) {
  return (
    <section id="introduction" className={styles.section} aria-labelledby="intro-statement">
      <div className="shell">
        <SectionLabel label={t.label} />

        <ScrollTextReveal as="h2" className={styles.statement}>
          <span id="intro-statement">{t.statement}</span>
        </ScrollTextReveal>

        <div className={styles.grid}>
          <Reveal as="p" variant="lines" className={styles.body}>
            {t.body}
          </Reveal>

          <Reveal as="ol" stagger={0.12} className={styles.pillars}>
            {t.pillars.map((pillar, i) => (
              <li key={pillar.title} className={styles.pillar}>
                <span className={styles.index} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarBody}>{pillar.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
