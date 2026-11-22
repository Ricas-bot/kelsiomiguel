import Image from "next/image";
import ProjectArt from "./ProjectArt";
import ScreenFrame from "./ScreenFrame";
import { cn } from "@/lib/utils";
import styles from "./ProjectCover.module.css";

/**
 * Project composition: the typographic art, with the project's real cover
 * screenshot rising from the bottom in a window frame when one exists.
 * `cover` comes from data/media.js via a Server Component, so client
 * bundles never pull in the whole media table. Decorative (the title and
 * description are real text elsewhere): empty alt, block is aria-hidden.
 * No blur placeholder: the frame's white canvas already stands in, and SVG
 * blur placeholders cost main-thread rendering time on the home page.
 */
export default function ProjectCover({ project, index, cover, size = "md", sizes, preload = false }) {
  return (
    <div className={cn(styles.cover, styles[size])} aria-hidden="true">
      <ProjectArt project={project} index={index} size={size} />
      {cover && (
        <div className={styles.shot}>
          <ScreenFrame size={size === "sm" ? "sm" : "md"}>
            <Image src={cover.src} alt="" sizes={sizes} preload={preload} draggable={false} />
          </ScreenFrame>
        </div>
      )}
    </div>
  );
}
