"use client";

import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "./config";

/** Persists an explicit language choice; read by src/proxy.js on "/". */
export function persistLocale(locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}
