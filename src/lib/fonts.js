import { Bricolage_Grotesque, DM_Mono, Manrope } from "next/font/google";

/**
 * Typography system — self-hosted at build time by next/font (no runtime
 * request to Google, automatic fallback metrics to avoid layout shift).
 *
 * - Display: Bricolage Grotesque (variable: wght + wdth + opsz). The width
 *   axis lets the giant headlines run condensed without a second family.
 * - Sans:    Manrope (variable wght) — body copy, carried over from v1.
 * - Mono:    DM Mono — labels, metadata, terminal. Carried over from v1.
 */
export const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  display: "swap",
  variable: "--font-bricolage"
});

export const sansFont = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope"
});

export const monoFont = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono"
});

export const fontVariables = [displayFont.variable, sansFont.variable, monoFont.variable].join(" ");
