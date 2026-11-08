"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Terminal from "./Terminal";

const TerminalContext = createContext(null);

/**
 * Owns the terminal's open state so any component (Navbar, Hero, mobile
 * menu…) can open it. Focus returns to whatever opened it on close.
 */
export function TerminalProvider({ lang, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const returnFocusRef = useRef(null);

  const open = useCallback(() => {
    returnFocusRef.current = document.activeElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    const target = returnFocusRef.current;
    requestAnimationFrame(() => target?.focus?.());
  }, []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <TerminalContext.Provider value={value}>
      {children}
      <AnimatePresence>{isOpen && <Terminal language={lang} onClose={close} />}</AnimatePresence>
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used inside <TerminalProvider>");
  return ctx;
}
