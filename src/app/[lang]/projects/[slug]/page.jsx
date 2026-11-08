import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import ProjectArt from "@/components/ui/ProjectArt";
import ProjectMorph from "@/components/ui/ProjectMorph";
import { TagList } from "@/components/ui/Tag";
import CaseToc from "@/components/case/CaseToc";
import { projects } from "@/data/projects";
import { getCaseStudy } from "@/data/caseStudies";
import { profile } from "@/data/profile";
import { getDictionary } from "@/i18n/getDictionary";
import { htmlLang, locales, ogLocale } from "@/i18n/config";
import { pad } from "@/lib/utils";
import styles from "@/components/case/CaseStudy.module.css";

/** Every project × locale is prerendered; unknown slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const description = project.description[lang];

  return {
    title: project.title,
    description,
    openGraph: {
      type: "article",
      title: `${project.title} — ${profile.name}`,
      description,
      locale: ogLocale[lang]
    },
    twitter: { card: "summary", title: `${project.title} — ${profile.name}`, description },
    ...(profile.siteUrl && {
      alternates: {
        canonical: `/${lang}/projects/${slug}`,
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}/projects/${slug}`]))
      }
    })
  };
}

export default async function CaseStudyPage({ params }) {
  const { lang, slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const study = getCaseStudy(slug);
  if (index < 0 || !study) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const dict = await getDictionary(lang);
  const t = dict.caseStudy;
  const w = dict.work;

  const sections = [
    { id: "context", label: t.sections.context },
    { id: "problem", label: t.sections.problem },
    { id: "solution", label: t.sections.solution },
    { id: "architecture", label: t.sections.architecture },
    { id: "stack", label: t.sections.stack },
    { id: "decisions", label: t.sections.decisions },
    study.results && { id: "results", label: t.sections.results },
    study.notes && { id: "notes", label: t.sections.notes }
  ].filter(Boolean);
  const num = (id) => pad(sections.findIndex((s) => s.id === id) + 1);

  const heading = (id) => (
    <h2 id={`${id}-title`} className={styles.blockTitle}>
      <span aria-hidden="true">{num(id)}</span>
      {t.sections[id]}
    </h2>
  );

  return (
    <PageTransition>
      <article className={styles.page} aria-labelledby="case-title">
        {/* ---------- Hero ---------- */}
        <header className={`shell ${styles.hero}`}>
          <Link href={`/${lang}#work`} className={styles.back}>
            <ArrowLeft size={16} aria-hidden="true" /> {t.back}
          </Link>

          <p className={styles.meta}>
            <span className={styles.index}>{pad(index + 1)}</span>
            <span>{project.category[lang]}</span>
            <span>{project.year}</span>
            {project.client && <span>{project.client}</span>}
          </p>

          <Reveal as="h1" id="case-title" variant="words" className={styles.title}>
            {project.title}
          </Reveal>

          <div className={styles.heroFoot}>
            <p className={styles.lead}>{project.description[lang]}</p>
            <div className={styles.links}>
              {project.liveUrl && (
                <Button href={project.liveUrl} variant="primary" icon={<ArrowUpRight />}>
                  {w.live}
                  <span className="sr-only"> ({dict.a11y.newTab})</span>
                </Button>
              )}
              {project.repoUrl ? (
                <Button href={project.repoUrl} variant={project.liveUrl ? "outline" : "primary"} icon={<Github />}>
                  {w.repo}
                  <span className="sr-only"> ({dict.a11y.newTab})</span>
                </Button>
              ) : (
                <span className={styles.private}>{w.private}</span>
              )}
            </div>
          </div>
        </header>

        <div className={`shell ${styles.media}`}>
          <ProjectMorph slug={project.slug}>
            <div>
              <ProjectArt project={project} index={index} size="lg" />
            </div>
          </ProjectMorph>
        </div>

        {/* ---------- Body ---------- */}
        <div className={`shell ${styles.body}`}>
          <aside className={styles.aside}>
            <CaseToc items={sections} label={t.toc} />
            <dl className={styles.facts}>
              <div>
                <dt>{t.year}</dt>
                <dd>{project.year}</dd>
              </div>
              {project.client && (
                <div>
                  <dt>{t.client}</dt>
                  <dd>{project.client}</dd>
                </div>
              )}
              <div>
                <dt>{t.category}</dt>
                <dd>{project.category[lang]}</dd>
              </div>
            </dl>
          </aside>

          <div className={styles.content}>
            <section id="context" aria-labelledby="context-title" className={styles.block}>
              {heading("context")}
              <Reveal as="p" variant="lines" className={styles.statement}>
                {study.context[lang]}
              </Reveal>
            </section>

            <section id="problem" aria-labelledby="problem-title" className={styles.block}>
              {heading("problem")}
              <Reveal as="p" variant="lines" className={styles.statement}>
                {study.problem[lang]}
              </Reveal>
            </section>

            <section id="solution" aria-labelledby="solution-title" className={styles.block}>
              {heading("solution")}
              <Reveal stagger={0.1} className={styles.prose}>
                {study.solution[lang].map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </Reveal>
            </section>

            <section id="architecture" aria-labelledby="architecture-title" className={styles.block}>
              {heading("architecture")}
              <Reveal as="ol" stagger={0.06} className={styles.flow}>
                {study.architecture.map((item, i) => (
                  <li key={item.name.en} className={styles.flowItem}>
                    <span className={styles.flowIndex} aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <h3 className={styles.flowName}>{item.name[lang]}</h3>
                    <p className={styles.flowBody}>{item.body[lang]}</p>
                  </li>
                ))}
              </Reveal>
            </section>

            <section id="stack" aria-labelledby="stack-title" className={styles.block}>
              {heading("stack")}
              <TagList items={study.stack} label={t.sections.stack} className={styles.stack} />
            </section>

            <section id="decisions" aria-labelledby="decisions-title" className={styles.block}>
              {heading("decisions")}
              <Reveal as="ol" stagger={0.08} className={styles.decisions}>
                {study.decisions.map((d) => (
                  <li key={d.title.en} className={styles.decision}>
                    <h3 className={styles.decisionTitle}>{d.title[lang]}</h3>
                    <p className={styles.decisionBody}>{d.body[lang]}</p>
                  </li>
                ))}
              </Reveal>
            </section>

            {study.results && (
              <section id="results" aria-labelledby="results-title" className={styles.block}>
                {heading("results")}
                <ul className={styles.points}>
                  {study.results[lang].map((r) => (
                    <li key={r.slice(0, 32)}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            {study.notes && (
              <section id="notes" aria-labelledby="notes-title" className={styles.block}>
                {heading("notes")}
                <ul className={`${styles.points} ${styles.notes}`}>
                  {study.notes[lang].map((n) => (
                    <li key={n.slice(0, 32)}>{n}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* ---------- Next project ---------- */}
        <nav aria-label={t.next} className={styles.nextWrap}>
          <Link
            href={`/${lang}/projects/${next.slug}`}
            className={`shell ${styles.next}`}
            data-cursor="project"
            data-cursor-label={w.cursor}
          >
            <span className={styles.nextLabel}>{t.next}</span>
            <span className={styles.nextTitle}>
              {next.title} <ArrowRight aria-hidden="true" />
            </span>
            <span className={styles.nextMeta}>{next.category[lang]}</span>
          </Link>
        </nav>
      </article>
    </PageTransition>
  );
}
