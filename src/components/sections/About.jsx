import Reveal from "@/components/effects/Reveal";
import Counter from "@/components/effects/Counter";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { formatMonthYear } from "@/lib/format";
import styles from "./About.module.css";

/**
 * About — editorial split: statement on the left, a short verified bio and
 * key facts (counting up) on the right, education and languages below.
 */
export default function About({ lang, t }) {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className="shell">
        <SectionLabel index={2} label={t.label} />

        <div className={styles.grid}>
          <Reveal as="h2" id="about-title" variant="lines" className={styles.title}>
            {t.title} <em className={styles.emphasis}>{t.emphasis}</em>
          </Reveal>

          <div className={styles.copy}>
            <Reveal stagger={0.1} className={styles.paragraphs}>
              {t.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Reveal>

            <dl className={styles.facts}>
              {profile.facts.map((fact) => (
                <div key={fact.value} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label[lang]}</dt>
                  <dd className={styles.factValue}>
                    <Counter value={fact.value} />
                  </dd>
                </div>
              ))}
            </dl>

            <dl className={styles.details}>
              <div>
                <dt>{t.education}</dt>
                <dd>
                  {profile.education.degree[lang]}
                  <span>
                    {profile.education.institution} · {t.graduated} {formatMonthYear(profile.education.graduated, lang)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>{t.languages}</dt>
                <dd>
                  {profile.languages.map((l) => `${l.name[lang]} (${l.level[lang]})`).join(" · ")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
