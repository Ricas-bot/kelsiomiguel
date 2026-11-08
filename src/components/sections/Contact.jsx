import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import Magnetic from "@/components/effects/Magnetic";
import { SectionLabel } from "@/components/ui/SectionHeading";
import CopyEmail from "./CopyEmail";
import { profile } from "@/data/profile";
import styles from "./Contact.module.css";

/**
 * Contact — the one full-bleed accent moment. Email (send + copy), LinkedIn
 * and GitHub. No form: there is no backend to deliver messages, and a form
 * that only looks like it sends would mislead.
 */
export default function Contact({ lang, t, a11y }) {
  const { email, github, linkedin } = profile.contact;

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className="shell">
        <SectionLabel index={5} label={t.label} tone="inverse" />

        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <Reveal as="h2" id="contact-title" variant="words" className={styles.title}>
          <span className={styles.titleLine}>{t.title}</span> <span className={styles.titleLine}>{t.line}</span>
        </Reveal>

        <div className={styles.grid}>
          <div className={styles.primary}>
            <Magnetic strength={0.15}>
              <a className={styles.email} href={`mailto:${email}`} data-cursor="link">
                <span>{email}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Magnetic>
            <div className={styles.actions}>
              <a className={styles.send} href={`mailto:${email}`}>
                {t.send}
              </a>
              <CopyEmail email={email} labels={{ copy: t.copy, copied: t.copied, copyFailed: t.copyFailed }} />
            </div>
          </div>

          <div className={styles.secondary}>
            <p className={styles.body}>{t.body}</p>
            <ul className={styles.social}>
              <li>
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={18} aria-hidden="true" /> LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> ({a11y.newTab})</span>
                </a>
              </li>
              <li>
                <a href={github} target="_blank" rel="noopener noreferrer">
                  <Github size={18} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> ({a11y.newTab})</span>
                </a>
              </li>
            </ul>
            <p className={styles.meta}>
              {profile.availability.enabled && (
                <>
                  <span aria-hidden="true">●</span> {profile.availability.label[lang]} ·{" "}
                </>
              )}
              {profile.location[lang]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
