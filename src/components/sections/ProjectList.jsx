"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectArt from "@/components/ui/ProjectArt";
import { TagList } from "@/components/ui/Tag";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "@/lib/motion";
import { pad } from "@/lib/utils";
import styles from "./Projects.module.css";

/**
 * Editorial project index. On desktop (fine pointer) a preview of the
 * hovered project floats with the cursor: GSAP moves the wrapper, Framer
 * Motion swaps the content inside (never both on one element). On touch,
 * a small composition is shown inline in each row instead.
 * Each row's title is the primary link (stretched over the row); live and
 * source links sit above it.
 */
export default function ProjectList({ projects, startIndex = 0, lang, labels }) {
  const fine = useMediaQuery(FINE_POINTER_QUERY, false);
  const [active, setActive] = useState(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (!fine || !previewRef.current || !listRef.current) return undefined;
    const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const el = previewRef.current;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: reduce ? 0 : 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: reduce ? 0 : 0.6, ease: "power3.out" });
    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const list = listRef.current;
    list.addEventListener("pointermove", onMove, { passive: true });
    return () => list.removeEventListener("pointermove", onMove);
  }, [fine]);

  return (
    <>
      <ul ref={listRef} className={styles.list} onPointerLeave={() => setActive(null)}>
        {projects.map((project, i) => {
          const index = startIndex + i;
          const href = project.liveUrl ?? project.repoUrl;
          return (
            <li
              key={project.slug}
              className={styles.row}
              onPointerEnter={() => setActive(index)}
              data-cursor={href ? "project" : undefined}
              data-cursor-label={href ? labels.cursor : undefined}
            >
              <span className={styles.rowIndex} aria-hidden="true">
                {pad(index + 1)}
              </span>

              <div className={styles.rowMain}>
                <h4 className={styles.rowTitle}>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.stretched}>
                      {project.title}
                      <span className="sr-only"> ({labels.newTab})</span>
                    </a>
                  ) : (
                    project.title
                  )}
                </h4>
                <p className={styles.rowDescription}>{project.description[lang]}</p>
              </div>

              <div className={styles.rowMeta}>
                <p className={styles.category}>
                  {project.category[lang]}
                  {project.client && ` · ${project.client}`}
                </p>
                <TagList items={project.tags} label={labels.stack} />
              </div>

              <span className={styles.rowYear}>{project.year}</span>

              <div className={styles.rowLinks} data-cursor="link">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    {labels.live} <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only">
                      {" "}
                      — {project.title} ({labels.newTab})
                    </span>
                  </a>
                )}
                {project.repoUrl ? (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    {labels.repo} <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only">
                      {" "}
                      — {project.title} ({labels.newTab})
                    </span>
                  </a>
                ) : (
                  <span className={styles.private}>{labels.private}</span>
                )}
              </div>

              {/* Inline composition for touch; hidden by CSS on fine pointers
                  (no JS-dependent markup, so no layout shift on hydration). */}
              <div className={styles.rowThumb} aria-hidden="true">
                <ProjectArt project={project} index={index} size="sm" />
              </div>
            </li>
          );
        })}
      </ul>

      {fine && (
        <div ref={previewRef} className={styles.preview} aria-hidden="true">
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.div
                key={active}
                className={styles.previewInner}
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectArt
                  project={projects[active - startIndex]}
                  index={active}
                  size="sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
