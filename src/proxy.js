import { NextResponse } from "next/server";
import { hasLocale, locales, LOCALE_COOKIE, negotiateLocale } from "@/i18n/config";

/**
 * Locale routing. Any path without a /pt or /en prefix is redirected:
 *   1. explicit choice stored in the NEXT_LOCALE cookie (set by the switcher);
 *   2. otherwise the browser's Accept-Language;
 *   3. otherwise the default locale (en).
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasPrefix) return;

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(cookieLocale) ? cookieLocale : negotiateLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Cookie, Accept-Language");
  return response;
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (assets, robots.txt, sitemap.xml…).
  matcher: ["/((?!_next|api|.*\\..*).*)"]
};
