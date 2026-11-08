"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./Contact.module.css";

/**
 * Copies the email address to the clipboard, announcing the result to
 * screen readers. If the Clipboard API is unavailable or blocked, it says
 * so instead of pretending to succeed.
 */
export default function CopyEmail({ email, labels }) {
  const [status, setStatus] = useState("idle");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <>
      <button type="button" className={styles.copy} onClick={copy} data-status={status}>
        {status === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        <span>{status === "copied" ? labels.copied : labels.copy}</span>
      </button>
      <p className={styles.copyStatus} role="status" aria-live="polite">
        {status === "failed" ? labels.copyFailed : status === "copied" ? <span className="sr-only">{labels.copied}</span> : null}
      </p>
    </>
  );
}
