import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared building blocks for generated share images (next/og ImageResponse,
 * rendered by Satori at build time). Satori only reads TTF/OTF/WOFF, so the
 * site's fonts are bundled as WOFF in src/assets/fonts (SIL OFL 1.1).
 * Satori rule: any element with more than one child needs display: flex.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export const C = {
  bg: "#0a0a0a",
  text: "#f1f0ec",
  muted: "#8f8f8a",
  subtle: "#5e5e5a",
  accent: "#c7ff4a",
  line: "rgba(241, 240, 236, 0.12)"
};

const fontDir = join(process.cwd(), "src", "assets", "fonts");

export async function loadOgFonts() {
  const [display, displayMedium, mono] = await Promise.all([
    readFile(join(fontDir, "BricolageGrotesque-ExtraBold.woff")),
    readFile(join(fontDir, "BricolageGrotesque-Medium.woff")),
    readFile(join(fontDir, "DMMono-Medium.woff"))
  ]);
  return [
    { name: "Bricolage", data: display, weight: 800, style: "normal" },
    { name: "Bricolage", data: displayMedium, weight: 500, style: "normal" },
    { name: "DM Mono", data: mono, weight: 500, style: "normal" }
  ];
}

/** Lime status dot (a glyph like "●" isn't in the bundled latin subset). */
export function Dot({ size = 12 }) {
  return <div style={{ width: size, height: size, borderRadius: 9999, background: C.accent, marginRight: 14 }} />;
}

/** Decorative orbit rings echoing the hero visual. */
export function Orbits() {
  // Satori ignores `right` on absolute elements: position from the left.
  const ring = (size, top, right, color) => (
    <div
      style={{
        position: "absolute",
        top,
        left: OG_SIZE.width - right - size,
        width: size,
        height: size,
        borderRadius: 9999,
        border: `1px solid ${color}`
      }}
    />
  );
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      {ring(620, -40, -140, C.line)}
      {ring(420, 60, -40, "rgba(199, 255, 74, 0.28)")}
      {ring(220, 160, 60, "rgba(199, 255, 74, 0.4)")}
      <div
        style={{
          position: "absolute",
          top: 262,
          left: OG_SIZE.width - 162 - 16,
          width: 16,
          height: 16,
          borderRadius: 9999,
          background: C.accent
        }}
      />
    </div>
  );
}

/** Frame shared by every share image: top bar, body, bottom bar. */
export function OgFrame({ topLeft, topRight, children, bottomLeft, bottomRight }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: C.bg,
        color: C.text,
        fontFamily: "Bricolage"
      }}
    >
      <Orbits />
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono", fontSize: 22, letterSpacing: 2, textTransform: "uppercase" }}>
        <div style={{ display: "flex", alignItems: "center", color: C.accent }}>{topLeft}</div>
        <div style={{ display: "flex", color: C.muted }}>{topRight}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex" }}>{bottomLeft}</div>
        <div style={{ display: "flex", alignItems: "center", fontFamily: "DM Mono", fontSize: 20, letterSpacing: 2, color: C.muted, textTransform: "uppercase" }}>
          {bottomRight}
        </div>
      </div>
    </div>
  );
}
