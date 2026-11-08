"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionLink from "@/components/ui/SectionLink";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";
import LanguageSwitch from "./LanguageSwitch";
import MobileMenu from "./MobileMenu";
import { useTerminal } from "@/components/terminal/TerminalProvider";
import { getLenis } from "@/components/effects/SmoothScroll";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { sections } from "@/data/navigation";
import { cn, pad } from "@/lib/utils";
import styles from "./Navbar.module.css";

const SECTION_IDS = sections.map((s) => s.id);

/**
 * Site header.
 *  - Typographic KM logo (scrolls to top when already on home).
 *  - Section links with an animated indicator for the section in view
 *    (aria-current="location").
 *  - PT/EN switcher, terminal trigger.
 *  - Transparent at the top, solid after scrolling, tucks away while
 *    scrolling down and returns on scroll up or keyboard focus.
 *  - Custom full-screen mobile menu (disclosure pattern).
 */
export default function Navbar({ lang, dict }) {
  const pathname = usePathname();
  const isHome = pathname === `/${lang}`;
  const active = useActiveSection(isHome ? SECTION_IDS : []);
  const { scrolled, hidden } = useHeaderScroll();
  const reducedMotion = useReducedMotion();
  const { open: openTerminal } = useTerminal();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  const closeMenu = useCallback(({ restoreFocus = false } = {}) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  // Close the menu on route change (state reset keyed on pathname).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  // Close if the viewport grows to desktop while the menu is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const mql = window.matchMedia("(min-width: 900px)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [menuOpen]);

  const onLogoClick = (event) => {
    if (!isHome) return;
    event.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    history.replaceState(null, "", `/${lang}`);
    closeMenu();
  };

  const links = sections.map(({ id }, index) => ({
    id,
    index: pad(index + 1),
    label: dict.nav[id],
    href: `/${lang}#${id}`
  }));

  return (
    <>
    <header
      className={cn(
        styles.header,
        (scrolled || menuOpen) && styles.scrolled,
        hidden && !menuOpen && styles.hidden,
        menuOpen && styles.menuOpen
      )}
    >
      <div className={cn("shell", styles.inner)}>
        <Link
          href={`/${lang}`}
          className={styles.logo}
          aria-label={dict.a11y.home}
          onClick={onLogoClick}
          data-intro-el
        >
          KM<span aria-hidden="true">®</span>
        </Link>

        <nav className={styles.nav} aria-label={dict.a11y.mainNav} data-intro-el>
          <ul className={styles.navList}>
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <SectionLink
                    href={link.href}
                    className={cn(styles.navLink, isActive && styles.navLinkActive)}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span className={styles.navIndex} aria-hidden="true">
                      {link.index}
                    </span>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className={styles.indicator}
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions} data-intro-el>
          <LanguageSwitch lang={lang} label={dict.a11y.language} currentLabel={dict.a11y.currentLanguage} />

          <button
            type="button"
            className={styles.terminalButton}
            onClick={() => {
              closeMenu();
              openTerminal();
            }}
            aria-label={dict.a11y.openTerminal}
          >
            <TerminalIcon size={15} aria-hidden="true" />
            <span className={styles.terminalLabel}>{dict.nav.terminal}</span>
          </button>

          <button
            ref={toggleRef}
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? dict.a11y.closeMenu : dict.a11y.openMenu}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.menuToggleText} aria-hidden="true">
              {menuOpen ? dict.nav.close : dict.nav.menu}
            </span>
            <span className={styles.burger} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>

      <MobileMenu
        open={menuOpen}
        links={links}
        active={active}
        dict={dict}
        onClose={closeMenu}
      />
    </>
  );
}
