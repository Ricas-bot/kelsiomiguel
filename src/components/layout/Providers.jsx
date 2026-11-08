"use client";

import { MotionConfig } from "framer-motion";
import { TerminalProvider } from "@/components/terminal/TerminalProvider";

/**
 * Client-side providers for the whole app.
 * MotionConfig `reducedMotion="user"` makes every Framer Motion animation
 * drop transform/layout motion when the OS asks for reduced motion.
 */
export default function Providers({ lang, children }) {
  return (
    <MotionConfig reducedMotion="user">
      <TerminalProvider lang={lang}>{children}</TerminalProvider>
    </MotionConfig>
  );
}
