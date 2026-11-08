import HeroMotion from "./HeroMotion";
import HeroActions from "./HeroActions";
import HeroVisual from "./HeroVisual";
import { profile } from "@/data/profile";
import styles from "./Hero.module.css";

/**
 * Hero — Server Component. All copy comes from the dictionary/profile;
 * motion is layered on by HeroMotion through data attributes:
 *   data-intro-el   pre-hidden by CSS on first load (see styles/intro.css)
 *   data-hero-*     animation targets
 */
export default function Hero({ lang, t }) {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <HeroMotion className={`shell ${styles.inner}`}>
        <div className={styles.topline}>
          {profile.availability.enabled ? (
            <p className={styles.availability} data-intro-el data-hero-meta>
              <span className={styles.pulse} aria-hidden="true" />
              {profile.availability.label[lang]}
            </p>
          ) : (
            <span />
          )}
          <p className={styles.meta} data-intro-el data-hero-meta>
            {profile.location[lang]}
          </p>
        </div>

        <div className={styles.stage}>
          <div className={styles.visual} data-hero-visual-scroll>
            <div className={styles.visualInner} data-intro-el data-hero-visual>
              <HeroVisual />
            </div>
          </div>

          <h1 id="hero-title" className={styles.name} data-intro-el data-hero-name>
            <span className={styles.line} data-line="1">
              Kelsio
            </span>{" "}
            <span className={`${styles.line} ${styles.lineTwo}`} data-line="2">
              Miguel
            </span>
          </h1>

          <div className={styles.copy} data-hero-copy>
            <p className={styles.role} data-intro-el>
              {t.title}
            </p>
            <p className={styles.statement} data-intro-el>
              {t.description}
            </p>
            <HeroActions lang={lang} labels={{ work: t.ctaWork, terminal: t.ctaTerminal }} />
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.meta} data-intro-el data-hero-meta>
            {t.pillars}
          </p>
          <div className={styles.scrollCue} data-intro-el data-scroll-cue aria-hidden="true">
            <span>{t.scroll}</span>
            <span className={styles.scrollLine} />
          </div>
          <p className={`${styles.meta} ${styles.since}`} data-intro-el data-hero-meta>
            {t.since}
          </p>
        </div>
      </HeroMotion>
    </section>
  );
}
