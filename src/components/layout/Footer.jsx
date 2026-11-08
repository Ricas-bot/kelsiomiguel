import SectionLink from "@/components/ui/SectionLink";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { sections } from "@/data/navigation";
import styles from "./Footer.module.css";

/** Site footer — Server Component (no client JS). */
export default function Footer({ lang, dict }) {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className={styles.footer}>
      <div className="shell">
        <p className={styles.wordmark} aria-hidden="true">
          Kelsio Miguel
        </p>

        <div className={styles.grid}>
          <nav aria-label={dict.a11y.footerNav}>
            <h2 className={styles.heading}>{dict.footer.navigation}</h2>
            <ul className={styles.list}>
              {sections.map(({ id }) => (
                <li key={id}>
                  <SectionLink href={`/${lang}#${id}`}>{dict.nav[id]}</SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={styles.heading}>{dict.footer.contact}</h2>
            <ul className={styles.list}>
              <li>
                <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
              </li>
              <li>
                <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
                  GitHub <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only">({dict.a11y.newTab})</span>
                </a>
              </li>
              <li>
                <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only">({dict.a11y.newTab})</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>{dict.footer.based}</h2>
            <p className={styles.text}>{profile.location[lang]}</p>
            {profile.availability.enabled && (
              <p className={styles.availability}>
                <span aria-hidden="true">●</span> {profile.availability.label[lang]}
              </p>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {year} {profile.name}
          </span>
          <span className={styles.built}>{dict.footer.builtBy}</span>
          <a href="#main" className={styles.top}>
            {dict.footer.backToTop} <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
