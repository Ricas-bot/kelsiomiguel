/**
 * Deterministic formatters (no Intl locale data dependency), so server and
 * client output can never differ.
 */
const MONTHS = {
  pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

/** "2025-07" → "Jul 2025" (pt/en). */
export function formatMonthYear(iso, lang) {
  if (!iso) return "";
  const [year, month] = iso.split("-").map(Number);
  return `${(MONTHS[lang] || MONTHS.en)[month - 1]} ${year}`;
}

/** Inclusive date range; `end` null → present label. */
export function formatRange(start, end, lang, presentLabel) {
  return `${formatMonthYear(start, lang)} — ${end ? formatMonthYear(end, lang) : presentLabel}`;
}
