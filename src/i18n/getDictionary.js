import { hasLocale } from "./config";

/**
 * Lazy-loaded dictionaries. Called from Server Components only, so the
 * full translation set never ships to the browser — Client Components
 * receive just the strings they need as props.
 */
const dictionaries = {
  pt: () => import("./dictionaries/pt").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default)
};

export async function getDictionary(locale) {
  if (!hasLocale(locale)) throw new Error(`Unsupported locale: ${locale}`);
  return dictionaries[locale]();
}
