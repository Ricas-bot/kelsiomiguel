"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

/**
 * The terminal (commands + all its data) is a separate chunk: it is not part
 * of the initial page load, and is fetched when the browser is idle or on
 * first open, whichever comes first.
 */
const Terminal = dynamic(() => import("./Terminal"), { ssr: false });
const preload = () => import("./Terminal");

const TerminalContext = createContext(null);

const isTyping = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * Owns the terminal's open state so any component (Navbar, Hero…) can open
 * it. Global shortcut: Ctrl/⌘+K toggles; ` (backtick) opens when not typing.
 * Closes on route change. Focus returns to whatever opened it.
 */
export function TerminalProvider({ lang, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const returnFocusRef = useRef(null);
  const pathname = usePathname();

  const open = useCallback(() => {
    returnFocusRef.current = document.activeElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    const target = returnFocusRef.current;
    // After React has committed (the terminal releases `inert` as it starts
    // closing), even when closing from a native listener (Ctrl+K).
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (target?.isConnected) target.focus?.();
      });
    }, 0);
  }, []);

  // Close when the route changes (e.g. a project link in the terminal).
  const [openPath, setOpenPath] = useState(pathname);
  if (openPath !== pathname) {
    setOpenPath(pathname);
    if (isOpen) setIsOpen(false);
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      const mod = event.ctrlKey || event.metaKey;
      if (mod && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) close();
        else open();
      } else if (event.key === "`" && !mod && !isOpen && !isTyping(event.target)) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, open, close]);

  // Warm the chunk when the browser is idle, so the first open is instant.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 2000));
    const id = idle(preload);
    return () => (window.cancelIdleCallback ?? clearTimeout)(id);
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
