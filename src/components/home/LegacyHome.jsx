"use client";

/**
 * TRANSITIONAL — the v1 home sections, now driven by the route locale and
 * server-provided strings. Header, footer and terminal moved to the layout
 * (Phase 3). Each section is replaced by its own component in Phases 4–5,
 * after which this file is deleted.
 */
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import ScrollTextReveal from "@/components/effects/ScrollTextReveal";
import Magnetic from "@/components/effects/Magnetic";
import SectionHeading, { SectionLabel } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { TagList } from "@/components/ui/Tag";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { variants } from "@/lib/motion";
import { pad } from "@/lib/utils";

function ProjectCard({ project, index, lang, cursorLabel }) {
  return (
    <motion.a
      href={project.liveUrl ?? project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-card project-${index + 1}`}
      variants={variants.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      whileHover={{ y: -8 }}
      data-cursor="project"
      data-cursor-label={cursorLabel}
    >
      <div className={`project-art art-${index + 1}`}>
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-grid" />
        <span className="art-index">{pad(index + 1)} / SELECTED WORK</span>
        <span className="art-word">{project.art}</span>
        <span className="art-arrow">
          <ArrowUpRight size={22} aria-hidden="true" />
        </span>
      </div>
      <div className="project-meta">
        <div>
          <h3>{project.title}</h3>
          <p>{project.description[lang]}</p>
        </div>
        <TagList items={project.tags} className="project-tags" />
      </div>
    </motion.a>
  );
}

export default function LegacyHome({ lang, t }) {
  return (
    <>
      <section className="intro-band">
        <ScrollTextReveal>{t.intro}</ScrollTextReveal>
      </section>

      <section className="work-section section-shell" id="work">
        <SectionHeading
          index={1}
          label={t.sections.work}
          title={t.work.title}
          count={`(${pad(projects.length)})`}
          aside={t.work.subtitle}
        />
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} lang={lang} cursorLabel={t.work.cursor} />
          ))}
        </div>
        <Button
          variant="link"
          href="https://github.com/Ricas-bot?tab=repositories"
          icon={<ArrowUpRight />}
          className="work-more"
        >
          {t.work.github}
        </Button>
      </section>

      <section className="about-section section-shell" id="about">
        <SectionLabel index={2} label={t.sections.about} />
        <div className="about-layout">
          <h2>
            {t.about.title}
            <em>{t.about.emphasis}</em>
          </h2>
          <div className="about-copy">
            <p>{t.about.body}</p>
            <p>{t.about.detail}</p>
            <div className="about-facts">
              {profile.facts.map((fact) => (
                <div key={fact.value}>
                  <strong>{fact.value}</strong>
                  <span>{fact.label[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="expertise-section section-shell" id="expertise">
        <SectionHeading index={3} label={t.sections.expertise} title={t.expertise.title} aside={t.expertise.subtitle} />
        <div className="expertise-list">
          {t.expertise.items.map((item, index) => (
            <motion.div
              key={item.title}
              className="expertise-item"
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <span>{pad(index + 1)}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowDownRight aria-hidden="true" />
            </motion.div>
          ))}
        </div>
        <div className="stack-line">
          <span>CORE TOOLKIT</span>
          <p>PHP / LARAVEL · JAVASCRIPT / REACT · NEXT.JS · SQL · MOODLE / TOTARA · REST / SOAP · LINUX · GIT</p>
        </div>
      </section>

      <section className="contact-section section-shell" id="contact">
        <SectionLabel index={4} label={t.sections.contact} tone="inverse" />
        <p className="eyebrow">{t.contact.eyebrow}</p>
        <h2>
          {t.contact.title}
          <br />
          <span>{t.contact.line}</span>
        </h2>
        <Magnetic strength={0.2}>
          <a className="contact-email" href={`mailto:${profile.contact.email}`}>
            {profile.contact.email} <ArrowUpRight aria-hidden="true" />
          </a>
        </Magnetic>
        <div className="social-links">
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
            <Github size={17} aria-hidden="true" /> GITHUB
          </a>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={17} aria-hidden="true" /> LINKEDIN
          </a>
          <a href={`mailto:${profile.contact.email}`}>
            <Mail size={17} aria-hidden="true" /> EMAIL
          </a>
        </div>
      </section>
    </>
  );
}
