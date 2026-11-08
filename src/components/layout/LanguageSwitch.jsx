"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { htmlLang, localeNames, localizePath, locales } from "@/i18n/config";
import { persistLocale } from "@/i18n/client";
import { cn } from "@/lib/utils";
import styles from "./LanguageSwitch.module.css";

/**
 * PT / EN switcher. Keeps the current path (and hash), stores the choice in
 * a cookie so "/" remembers it, and marks each option with its own `lang`.
 */
export default function LanguageSwitch({ lang, label, currentLabel, className }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ul className={cn(styles.list, className)} aria-label={label}>
      {locales.map((locale) => (
        <li key={locale}>
          {locale === lang ? (
            <span className={cn(styles.option, styles.current)} lang={htmlLang[locale]}>
              <span aria-hidden="true">{locale.toUpperCase()}</span>
              <span className="sr-only">
                {localeNames[locale]} ({currentLabel})
              </span>
            </span>
          ) : (
            <Link
              href={localizePath(pathname, locale)}
              className={styles.option}
              hrefLang={htmlLang[locale]}
              lang={htmlLang[locale]}
              onClick={(event) => {
                persistLocale(locale);
                const hash = window.location.hash;
                if (hash) {
                  event.preventDefault();
                  router.push(`${localizePath(pathname, locale)}${hash}`);
                }
              }}
            >
              <span aria-hidden="true">{locale.toUpperCase()}</span>
              <span className="sr-only">{localeNames[locale]}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
