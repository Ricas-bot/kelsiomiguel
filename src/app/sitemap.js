import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { htmlLang, locales } from "@/i18n/config";

/**
 * /sitemap.xml - every page in every locale, with hreflang alternates.
 * Sitemaps require absolute URLs, so without a known site URL (see
 * profile.siteUrl) this returns an empty list instead of inventing one.
 */
export default function sitemap() {
  const base = profile.siteUrl;
  if (!base) return [];

  const paths = ["", ...projects.map((p) => `/projects/${p.slug}`)];

  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${base}/${lang}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `${base}/${l}${path}`]))
      }
    }))
  );
}
