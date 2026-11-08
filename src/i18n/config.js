/**
 * Internationalisation config. To add a language:
 *   1. add its code to `locales` and an entry to each map below;
 *   2. create src/i18n/dictionaries/<code>.js with the same shape as pt.js;
 *   3. register it in src/i18n/getDictionary.js;
 *   4. add the `{ pt, en, <code> }` field to bilingual content in src/data/.
 */
export const locales = ["pt", "en"];

/** Used for x-default and when nothing else matches during negotiation. */
export const defaultLocale = "en";

/** Cookie holding an explicit language choice made with the switcher. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** BCP 47 tag for <html lang> and hreflang. */
export const htmlLang = { pt: "pt-PT", en: "en" };

/** Open Graph locale. */
export const ogLocale = { pt: "pt_PT", en: "en_GB" };

/** Each language named in itself (used by the switcher). */
export const localeNames = { pt: "Português", en: "English" };

export function hasLocale(value) {
  return locales.includes(value);
}

/**
 * Picks the best supported locale from an Accept-Language header.
 * Dependency-free: sorts by q-value and matches the primary subtag.
 */
export function negotiateLocale(acceptLanguage) {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (hasLocale(primary)) return primary;
  }
  return defaultLocale;
}

/** Swaps the locale prefix of a pathname: ("/pt/projects/x", "en") → "/en/projects/x". */
export function localizePath(pathname, locale) {
  const pattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`);
  const rest = pathname.replace(pattern, "");
  return `/${locale}${rest === "/" ? "" : rest}`;
}
