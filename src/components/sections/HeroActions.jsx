"use client";

import { ArrowDownRight, Terminal as TerminalIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/effects/Magnetic";
import { handleSectionClick } from "@/components/ui/SectionLink";
import { useTerminal } from "@/components/terminal/TerminalProvider";
import styles from "./Hero.module.css";

/** Hero calls to action: jump to work (smooth) and open the terminal. */
export default function HeroActions({ lang, labels }) {
  const { open } = useTerminal();

  return (
    <div className={styles.actions} data-intro-el data-hero-actions>
      <Magnetic>
        <Button href={`/${lang}#work`} variant="primary" icon={<ArrowDownRight />} onClick={handleSectionClick}>
          {labels.work}
        </Button>
      </Magnetic>
      <Magnetic>
        <Button variant="outline" icon={<TerminalIcon />} onClick={open}>
          {labels.terminal}
        </Button>
      </Magnetic>
    </div>
  );
}
