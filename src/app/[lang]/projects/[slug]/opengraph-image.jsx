import { ImageResponse } from "next/og";
import { C, Dot, OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";
import { projects } from "@/data/projects";
import { hasLocale, defaultLocale } from "@/i18n/config";

/** Share image for each case study, per locale (generated at build time). */
export const alt = "Case study - Kelsio Miguel";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Prerender one image per project × locale at build time. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }) {
  const { lang: raw, slug } = await params;
  const lang = hasLocale(raw) ? raw : defaultLocale;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index] ?? projects[0];
  const meta = [project.category[lang], String(project.year), project.client].filter(Boolean).join(" · ");
  const titleSize = project.title.length > 16 ? 104 : project.title.length > 11 ? 124 : 150;
  const desc = project.description[lang];
  // Cut on a word boundary, never mid-word.
  const shortDesc = desc.length > 110 ? `${desc.slice(0, 108).replace(/[\s,;:]+\S*$/, "")}...` : desc;

  return new ImageResponse(
    (
      <OgFrame
        topLeft={`Case study · ${String(index + 1).padStart(2, "0")}`}
        topRight="Kelsio Miguel"
        bottomLeft={
          <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 22, letterSpacing: 2, color: C.muted, textTransform: "uppercase" }}>
            {meta}
          </div>
        }
        bottomRight={
          <>
            <Dot size={10} /> KM
          </>
        }
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 900,
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: -3,
            textTransform: "uppercase"
          }}
        >
          {project.title}
        </div>
        <div style={{ display: "flex", marginTop: 24, marginBottom: 12, maxWidth: 860, fontSize: 28, fontWeight: 500, lineHeight: 1.3, color: C.muted }}>
          {shortDesc}
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
