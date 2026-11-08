import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import SmoothScroll from "@/components/effects/SmoothScroll";
import CustomCursor from "@/components/effects/CustomCursor";
import { getDictionary } from "@/i18n/getDictionary";
import { defaultLocale, hasLocale, htmlLang, locales, ogLocale } from "@/i18n/config";
import { profile } from "@/data/profile";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

/**
 * Runs during HTML parsing, before first paint: on a full load of a home
 * page (and motion allowed) it flags the intro so styles/intro.css can
 * pre-hide the elements HeroMotion will animate — no flash of final state.
 */
const HOME_PATH = new RegExp("^/(" + locales.join("|") + ")/?$");
const INTRO_SCRIPT =
  "(function(){try{var d=document.documentElement;if(" +
  HOME_PATH.toString() +
  '.test(location.pathname)&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-intro","pending")}}catch(e){}})()';

/** Only /pt and /en exist; anything else 404s. Both are prerendered. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark"
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  // Absolute URLs (canonical, hreflang) only once a real domain is set.
  const seo = profile.siteUrl
    ? {
        metadataBase: new URL(profile.siteUrl),
        alternates: {
          canonical: `/${lang}`,
          languages: {
            ...Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
            "x-default": `/${defaultLocale}`
          }
        }
      }
    : {};

  return {
    title: { default: dict.meta.title, template: `%s — ${profile.name}` },
    description: dict.meta.description,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: profile.contact.github }],
    creator: profile.name,
    openGraph: {
      type: "website",
      siteName: profile.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l])
    },
    twitter: {
      card: "summary",
      title: dict.meta.title,
      description: dict.meta.description
    },
    ...seo
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    // suppressHydrationWarning: INTRO_SCRIPT and Lenis/cursor add attributes
    // and classes to <html> before/after React hydrates.
    <html lang={htmlLang[lang]} className={fontVariables} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <a className="skip-link" href="#main">
          {dict.a11y.skipToContent}
        </a>
        <div className="noise" aria-hidden="true" />
        <Providers lang={lang}>
          <SmoothScroll />
          <CustomCursor />
          <Navbar lang={lang} dict={{ nav: dict.nav, a11y: dict.a11y }} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer lang={lang} dict={dict} />
        </Providers>
      </body>
    </html>
  );
}
