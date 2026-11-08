import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ProjectArt from "@/components/ui/ProjectArt";
import ProjectMorph from "@/components/ui/ProjectMorph";
import { TagList } from "@/components/ui/Tag";
import ScrollScale from "@/components/effects/ScrollScale";
import Reveal from "@/components/effects/Reveal";
import ProjectList from "./ProjectList";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { pad } from "@/lib/utils";
import styles from "./Projects.module.css";

/**
 * Selected Work — the lead project takes most of the screen (media grows in
 * with the scroll); the others follow as an editorial index with hover
 * previews. Titles and media open the case study (/[lang]/projects/[slug]);
 * live and source links stay external. The composition morphs into the case
 * study hero via a shared view transition (ProjectMorph).
 */
export default function Projects({ lang, t, a11y }) {
  const [lead, ...rest] = projects;
  const leadHref = `/${lang}/projects/${lead.slug}`;

  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className="shell">
        <SectionHeading
          index={1}
          id="work-title"
          label={t.label}
          title={t.title}
          count={`(${pad(projects.length)})`}
          aside={t.aside}
        />

        <article className={styles.lead} aria-labelledby={`project-${lead.slug}`}>
          <Link
            href={leadHref}
            className={styles.leadMedia}
            tabIndex={-1}
            aria-hidden="true"
            data-cursor="project"
            data-cursor-label={t.cursor}
          >
            <ProjectMorph slug={lead.slug}>
              <div>
                <ScrollScale>
                  <ProjectArt project={lead} index={0} size="lg" />
                </ScrollScale>
              </div>
            </ProjectMorph>
          </Link>

          <Reveal className={styles.leadInfo} stagger={0.08}>
            <p className={styles.kicker}>
              <span className={styles.dot} aria-hidden="true" />
              {t.featured}
            </p>
            <h3 id={`project-${lead.slug}`} className={styles.leadTitle}>
              <Link href={leadHref}>{lead.title}</Link>
            </h3>
            <p className={styles.category}>
              {lead.category[lang]}
              {lead.client && ` · ${lead.client}`}
            </p>
            <p className={styles.description}>{lead.description[lang]}</p>
            <dl className={styles.facts}>
              <div>
                <dt>{t.year}</dt>
                <dd>{lead.year}</dd>
              </div>
              <div>
                <dt>{t.stack}</dt>
                <dd>
                  <TagList items={lead.tags} label={t.stack} />
                </dd>
              </div>
            </dl>
            <div className={styles.links}>
              <Button href={leadHref} variant="primary" icon={<ArrowRight />}>
                {t.caseStudy}
              </Button>
              {lead.liveUrl && (
                <Button href={lead.liveUrl} variant="outline" icon={<ArrowUpRight />}>
                  {t.live}
                  <span className="sr-only"> ({a11y.newTab})</span>
                </Button>
              )}
              {lead.repoUrl ? (
                <Button href={lead.repoUrl} variant="outline" icon={<Github />}>
                  {t.repo}
                  <span className="sr-only"> ({a11y.newTab})</span>
                </Button>
              ) : (
                <span className={styles.private}>{t.private}</span>
              )}
            </div>
          </Reveal>
        </article>

        <div className={styles.more}>
          <h3 className={styles.moreTitle}>{t.more}</h3>
          <ProjectList
            projects={rest}
            startIndex={1}
            lang={lang}
            labels={{ live: t.live, repo: t.repo, private: t.private, cursor: t.cursor, stack: t.stack, newTab: a11y.newTab }}
          />
        </div>

        <Button
          href={`${profile.contact.github}?tab=repositories`}
          variant="link"
          icon={<ArrowUpRight />}
          className={styles.all}
        >
          {t.github}
          <span className="sr-only"> ({a11y.newTab})</span>
        </Button>
      </div>
    </section>
  );
}
