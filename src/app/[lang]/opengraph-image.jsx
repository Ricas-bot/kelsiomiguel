import { ImageResponse } from "next/og";
import { C, Dot, OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";
import { profile } from "@/data/profile";
import { hasLocale, defaultLocale, locales } from "@/i18n/config";

/** Share image for the home page, per locale (generated at build time). */
export const alt = "Kelsio Miguel - Full-Stack Developer & LMS Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Prerender one image per locale at build time (fonts are read from disk then). */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : defaultLocale;

  return new ImageResponse(
    (
      <OgFrame
        topLeft={
          <>
            <Dot /> KM
          </>
        }
        topRight={profile.location[lang]}
        bottomLeft={
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 500 }}>Full-Stack Developer · LMS Engineer</div>
            {profile.availability.enabled && (
              <div style={{ display: "flex", alignItems: "center", fontFamily: "DM Mono", fontSize: 20, letterSpacing: 2, color: C.accent, textTransform: "uppercase" }}>
                <Dot size={10} /> {profile.availability.label[lang]}
              </div>
            )}
          </div>
        }
        bottomRight="Portfolio"
      >
        <div style={{ display: "flex", fontSize: 176, fontWeight: 800, lineHeight: 0.84, letterSpacing: -4 }}>KELSIO</div>
        <div style={{ display: "flex", fontSize: 176, fontWeight: 800, lineHeight: 0.84, letterSpacing: -4, color: C.subtle, marginLeft: 120 }}>
          MIGUEL
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
