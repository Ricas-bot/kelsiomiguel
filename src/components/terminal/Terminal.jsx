"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useIsPresent } from "framer-motion";
import { X } from "lucide-react";
import { complete, runCommand, suggest } from "./commands";
import { strings } from "./strings";
import { cn } from "@/lib/utils";
import styles from "./Terminal.module.css";

const HISTORY_KEY = "km-terminal-history";
const HISTORY_MAX = 50;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items) {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(-HISTORY_MAX)));
  } catch {
    /* storage unavailable (private mode): history stays in memory only */
  }
}

/**
 * Interactive terminal (modal dialog).
 * Keyboard: Enter runs · ↑/↓ history · Tab completes (when typing) ·
 * Ctrl+L clears · Ctrl+C cancels the line · Esc closes.
 * Accessibility: role="dialog" + aria-modal, focus trapped inside, page
 * behind is inert and scroll-locked, output is a polite live log, focus
 * returns to the trigger on close (TerminalProvider).
 */
export default function Terminal({ language, onClose }) {
  const s = strings[language];
  const [entries, setEntries] = useState([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState(loadHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [candidates, setCandidates] = useState([]);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const idRef = useRef(0);
  const isPresent = useIsPresent();

  // Focus on open.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll lock + inert background while open. Released as soon as the
  // terminal starts closing (not after its exit animation), so focus can
  // return to the trigger, which lives in the inert header.
  useLayoutEffect(() => {
    if (!isPresent) return undefined;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const background = [document.querySelector("header"), document.getElementById("main"), document.getElementById("site-footer")].filter(Boolean);
    background.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      root.style.overflow = previousOverflow;
      background.forEach((el) => el.removeAttribute("inert"));
    };
  }, [isPresent]);

  // Keep the newest output in view (instant: no smooth scroll to respect reduced motion).
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries, candidates]);

  const run = (raw) => {
    const command = raw.trim();
    setCandidates([]);
    setValue("");
    setHistoryIndex(-1);
    if (!command) return;

    const nextHistory = [...history.filter((h) => h !== command), command].slice(-HISTORY_MAX);
    setHistory(nextHistory);
    saveHistory(nextHistory);

    const result = runCommand(command, language);
    if (result.effect?.type === "exit") {
      onClose();
      return;
    }
    if (result.effect?.type === "clear") {
      setEntries([]);
      return;
    }
    if (result.effect?.type === "open") {
      window.open(result.effect.url, "_blank", "noopener,noreferrer");
    }
    idRef.current += 1;
    setEntries((items) => [...items, { id: idRef.current, command, blocks: result.blocks, error: result.error }]);
  };

  const onInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      run(value);
    } else if (event.key === "ArrowUp") {
      if (!history.length) return;
      event.preventDefault();
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown") {
      if (historyIndex < 0) return;
      event.preventDefault();
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setValue("");
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
    } else if (event.key === "Tab" && value.trim() && !event.shiftKey) {
      // Only completes while typing; with an empty line Tab moves focus as usual.
      event.preventDefault();
      const result = complete(value);
      setValue(result.value);
      setCandidates(result.candidates);
    } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setEntries([]);
      setCandidates([]);
    } else if (event.ctrlKey && event.key.toLowerCase() === "c" && !window.getSelection()?.toString()) {
      event.preventDefault();
      setValue("");
      setCandidates([]);
      setHistoryIndex(-1);
    }
  };

  // Escape closes; Tab is trapped inside the dialog.
  const onDialogKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || event.defaultPrevented) return;
    const focusables = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const chips = suggest(value);

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        className={styles.window}
        role="dialog"
        aria-modal="true"
        aria-label={s.dialogLabel}
        onKeyDown={onDialogKeyDown}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.bar}>
          <span className={styles.barTitle}>
            <span className={styles.barDot} aria-hidden="true" />
            {s.title}
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label={s.close}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body} data-lenis-prevent onClick={() => inputRef.current?.focus()}>
          <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-relevant="additions">
            <div className={styles.intro}>
              <p className={styles.banner}>{s.banner}</p>
              <p>{s.welcome}</p>
              <p className={styles.muted}>{s.hints}</p>
            </div>

            {entries.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <p className={styles.echo}>
                  <span className={styles.prompt} aria-hidden="true">
                    {s.prompt}
                  </span>{" "}
                  {entry.command}
                </p>
                {entry.blocks.map((block, i) => (
                  <OutputBlock key={i} block={block} index={i} onNavigate={onClose} />
                ))}
              </div>
            ))}

            {candidates.length > 0 && (
              <p className={styles.muted}>
                {s.candidates} {candidates.join("  ")}
              </p>
            )}
          </div>
        </div>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
          }}
        >
          <label htmlFor="terminal-input" className={styles.prompt}>
            <span aria-hidden="true">{s.prompt}</span>
            <span className="sr-only">{s.inputLabel}</span>
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            className={styles.input}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setCandidates([]);
            }}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            enterKeyHint="send"
            aria-describedby="terminal-suggestions"
          />
        </form>

        <div className={styles.footer}>
          <div id="terminal-suggestions" className={styles.chips} aria-label={s.suggestions} role="group">
            {chips.map((c) => (
              <button key={c} type="button" className={styles.chip} onClick={() => run(c)}>
                {c}
              </button>
            ))}
          </div>
          <p className={styles.status}>
            <span className={styles.online}>● {s.status.online}</span>
            <span className={styles.shortcut}>{s.status.shortcut}</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OutputBlock({ block, index, onNavigate }) {
  const style = { "--i": index };

  if (block.kind === "rows") {
    return (
      <dl className={styles.rows} style={style}>
        {block.rows.map(([key, val, href]) => (
          <div key={key} className={styles.row}>
            <dt>{key}</dt>
            <dd>{href ? <ExternalLink href={href}>{val}</ExternalLink> : val}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (block.kind === "list") {
    return (
      <ol className={styles.list} style={style}>
        {block.items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.listLink} onClick={onNavigate}>
              <span className={styles.muted}>{item.index}</span>
              <span className={styles.listLabel}>{item.label}</span>
              <span className={styles.listMeta}>{item.meta}</span>
              <span className={styles.muted}>{item.aside}</span>
            </Link>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p className={cn(styles.line, block.tone && styles[block.tone])} style={style}>
      {block.text}
    </p>
  );
}

function ExternalLink({ href, children }) {
  const external = href.startsWith("http");
  return (
    <a href={href} className={styles.link} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
      {children}
    </a>
  );
}
