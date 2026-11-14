import { ImageResponse } from "next/og";
import { C, loadOgFonts } from "@/lib/og";

/** Apple touch icon (180×180 PNG), same mark as icon.svg. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          color: C.text,
          fontFamily: "Bricolage",
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: -4
        }}
      >
        KM
        <div style={{ position: "absolute", top: 34, right: 26, width: 18, height: 18, borderRadius: 9999, background: C.accent }} />
      </div>
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
