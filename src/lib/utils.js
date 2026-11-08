/** Joins truthy class names: cn("a", cond && "b", undefined) → "a b". */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/** Zero-pads an index for editorial numbering: pad(3) → "03". */
export function pad(value, length = 2) {
  return String(value).padStart(length, "0");
}

/** True for absolute http(s) / mailto / tel links that leave the app. */
export function isExternalHref(href = "") {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}
