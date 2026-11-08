"use client";

import SectionLink from "@/components/ui/SectionLink";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn, pad } from "@/lib/utils";
import styles from "./CaseStudy.module.css";

/** Sticky table of contents; marks the section in view with aria-current. */
export default function CaseToc({ items, label }) {
  const active = useActiveSection(items.map((i) => i.id));

  return (
    <nav aria-label={label} className={styles.toc}>
      <p className={styles.asideLabel}>{label}</p>
      <ol className={styles.tocList}>
        {items.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <SectionLink
                href={`#${item.id}`}
                className={cn(styles.tocLink, isActive && styles.tocLinkActive)}
                aria-current={isActive ? "location" : undefined}
              >
                <span aria-hidden="true">{pad(i + 1)}</span>
                {item.label}
              </SectionLink>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
