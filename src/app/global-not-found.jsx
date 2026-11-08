import Link from "next/link";
import pt from "@/i18n/dictionaries/pt";
import en from "@/i18n/dictionaries/en";
import { htmlLang } from "@/i18n/config";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";
import styles from "./global-not-found.module.css";

/**
 * 404 for any unmatched URL (and notFound() calls). Rendered outside the
 * [lang] layout, so the locale is unknown: the page is bilingual, each block
 * marked with its own `lang`, linking to both home pages.
 * Next adds <meta name="robots" content="noindex"> automatically.
 */
export const metadata = {
  title: "404 — Kelsio Miguel",
  description: `${pt.notFound.title} · ${en.notFound.title}`
};

const variants = [
  { locale: "pt", dict: pt },
  { locale: "en", dict: en }
];

export default function GlobalNotFound() {
  return (
    <html lang={htmlLang.en} className={fontVariables}>
      <body>
        <main id="main" className={`shell ${styles.root}`}>
          <Link href="/" className={styles.logo} aria-label="Kelsio Miguel">
            KM<span aria-hidden="true">®</span>
          </Link>

          <p className={styles.code} aria-hidden="true">
            404
          </p>

          <div className={styles.columns}>
            {variants.map(({ locale, dict }) => (
              <section key={locale} lang={htmlLang[locale]} className={styles.block}>
                <h1 className={styles.title}>{dict.notFound.title}</h1>
                <p className={styles.body}>{dict.notFound.body}</p>
                <Link href={`/${locale}`} className={styles.cta} hrefLang={htmlLang[locale]}>
                  {dict.notFound.cta} <span aria-hidden="true">→</span>
                </Link>
              </section>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
