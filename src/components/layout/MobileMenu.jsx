"use client";

import { useEffect, useRef } from "react";
import SectionLink from "@/components/ui/SectionLink";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { duration, easing } from "@/lib/motion";
import { cn } from "@/lib/utils";
import styles from "./MobileMenu.module.css";

/**
 * Full-screen mobile menu (disclosure pattern, controlled by the toggle in
 * Navbar). While open: page content behind it is `inert`, page scroll is
 * locked, Escape closes and returns focus to the toggle, and focus moves
 * to the first link.
 */
export default function MobileMenu({ open, links, active, dict, onClose }) {
  const firstLinkRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;

    const background = [document.getElementById("main"), document.getElementById("site-footer")].filter(Boolean);
    background.forEach((el) => el.setAttribute("inert", ""));
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose({ restoreFocus: true });
    };
    window.addEventListener("keydown", onKeyDown);
    const focusTimer = setTimeout(() => firstLinkRef.current?.focus(), 50);

    return () => {
      background.forEach((el) => el.removeAttribute("inert"));
      document.documentElement.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  const panel = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { clipPath: "inset(0% 0% 100% 0%)" },
        visible: { clipPath: "inset(0% 0% 0% 0%)" },
        exit: { clipPath: "inset(0% 0% 100% 0%)" }
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className={styles.menu}
          data-lenis-prevent
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: duration.slow, ease: easing.outExpo }}
        >
          <nav aria-label={dict.a11y.mainNav}>
            <motion.ul
              className={styles.list}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } } }}
            >
              {links.map((link, i) => (
                <li key={link.id} className={styles.item}>
                  <motion.span
                    className={styles.reveal}
                    variants={{
                      hidden: { y: "100%" },
                      visible: { y: "0%", transition: { duration: duration.slow, ease: easing.outExpo } }
                    }}
                  >
                    <SectionLink
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      className={cn(styles.link, active === link.id && styles.active)}
                      aria-current={active === link.id ? "location" : undefined}
                      onClick={() => onClose()}
                    >
                      <span className={styles.index} aria-hidden="true">
                        {link.index}
                      </span>
                      {link.label}
                    </SectionLink>
                  </motion.span>
                </li>
              ))}
            </motion.ul>
          </nav>

          <motion.div
            className={styles.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4, duration: duration.base } }}
          >
            <ul className={styles.social}>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
