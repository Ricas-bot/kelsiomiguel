import FocusList from "@/components/effects/FocusList";
import SectionHeading from "@/components/ui/SectionHeading";
import { TagList } from "@/components/ui/Tag";
import { skillGroups } from "@/data/skills";
import { pad } from "@/lib/utils";
import styles from "./Expertise.module.css";

/**
 * Expertise — seven areas as a large typographic list; the area at the
 * reading line comes into focus as you scroll (others dim). Toolkit below,
 * grouped from the CV. No progress bars or ratings by design.
 */
export default function Expertise({ lang, t }) {
  return (
    <section id="expertise" className={styles.section} aria-labelledby="expertise-title">
      <div className="shell">
        <SectionHeading index={4} id="expertise-title" label={t.label} title={t.title} aside={t.aside} />

        <FocusList className={styles.list}>
          {t.areas.map((area, i) => (
            <li key={area.id} className={styles.item} data-focus-item>
              <span className={styles.index} aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h3 className={styles.title}>{area.title}</h3>
              <div className={styles.detail}>
                <p className={styles.description}>{area.description}</p>
                <TagList items={area.tags} label={area.title} />
              </div>
            </li>
          ))}
        </FocusList>

        <div className={styles.toolkit}>
          <h3 className={styles.toolkitTitle}>{t.toolkit}</h3>
          <dl className={styles.groups}>
            {skillGroups.map((group) => (
              <div key={group.id} className={styles.group}>
                <dt>{group.label[lang]}</dt>
                <dd>{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
