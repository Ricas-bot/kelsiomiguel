import Reveal from "@/components/effects/Reveal";
import ScrollProgress from "@/components/effects/ScrollProgress";
import SectionHeading from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";
import { clients } from "@/data/clients";
import { formatRange } from "@/lib/format";
import styles from "./Experience.module.css";

const VISIBLE_HIGHLIGHTS = 4;

/**
 * Experience — chronological roles on a timeline whose spine fills with the
 * scroll, then the client engagements (named with Kelsio's approval, scope
 * exactly as stated in the CV) as an accessible table.
 */
export default function Experience({ lang, t }) {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <div className="shell">
        <div className={styles.layout}>
          <div className={styles.heading}>
            <SectionHeading index={3} id="experience-title" label={t.label} title={t.title} aside={t.aside} stacked />
          </div>

          <div className={styles.timeline}>
            <ScrollProgress className={styles.spine} />
            <ol className={styles.roles}>
            {experience.map((role) => {
              const items = role.highlights[lang];
              const visible = items.slice(0, VISIBLE_HIGHLIGHTS);
              const hidden = items.slice(VISIBLE_HIGHLIGHTS);
              return (
                <li key={role.id} className={styles.role}>
                  <span className={styles.marker} aria-hidden="true" />
                  <p className={styles.dates}>
                    {formatRange(role.start, role.end, lang, t.present)}
                    {!role.end && <span className={styles.current}>●</span>}
                  </p>
                  <h3 className={styles.roleTitle}>{role.role[lang]}</h3>
                  <p className={styles.company}>{role.company}</p>
                  <ul className={styles.highlights}>
                    {visible.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  {hidden.length > 0 && (
                    <details className={styles.more}>
                      <summary>
                        {t.showAll} <span aria-hidden="true">({items.length})</span>
                      </summary>
                      <ul className={styles.highlights}>
                        {hidden.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              );
            })}
            </ol>
          </div>
        </div>

        <div className={styles.clients}>
          <div className={styles.clientsHeader}>
            <h3 className={styles.clientsTitle}>{t.clientsTitle}</h3>
            <p className={styles.clientsAside}>{t.clientsAside}</p>
          </div>

          <table className={styles.table}>
            <caption className="sr-only">{t.clientsTitle}</caption>
            <thead>
              <tr>
                <th scope="col">{t.columns.client}</th>
                <th scope="col">{t.columns.platform}</th>
                <th scope="col">{t.columns.market}</th>
                <th scope="col">{t.columns.scope}</th>
              </tr>
            </thead>
            <Reveal as="tbody" stagger={0.05} start="top 90%">
              {clients.map((c) => (
                <tr key={c.id}>
                  <th scope="row" className={styles.clientName}>
                    {c.name}
                  </th>
                  <td data-label={t.columns.platform}>{c.platform}</td>
                  <td data-label={t.columns.market}>
                    <span className={styles.market}>
                      <abbr title={t.markets[c.market]}>{c.market}</abbr>
                      <span className={styles.marketName}>{t.markets[c.market]}</span>
                    </span>
                  </td>
                  <td data-label={t.columns.scope} className={styles.scope}>
                    {c.scope[lang]}
                  </td>
                </tr>
              ))}
            </Reveal>
          </table>
        </div>
      </div>
    </section>
  );
}
