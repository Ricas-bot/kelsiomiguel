"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import ScreenFrame from "@/components/ui/ScreenFrame";
import { getLenis } from "@/components/effects/SmoothScroll";
import { cn, pad } from "@/lib/utils";
import styles from "./CaseGallery.module.css";

/**
 * "On screen" section of a case study: framed screenshots (each opens a
 * lightbox, a native modal <dialog>: focus trap, Escape and focus return
 * come from the platform) and before/after pairs with a two-state toggle.
 * Small screenshots are never upscaled (max-width = natural width).
 */
export default function CaseGallery({ items = [], compare = [], labels, lang }) {
  const [open, setOpen] = useState(null);
  const dialogRef = useRef(null);
  const current = open === null ? null : items[open];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open === null || !dialog || dialog.open) return;
    dialog.showModal();
    getLenis()?.stop();
  }, [open]);

  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (dir) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length]
  );

  const onKeyDown = (e) => {
    if (items.length < 2) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  return (
    <>
      {items.length > 0 && (
        <ul className={styles.grid}>
          {items.map((item, i) => (
            <li
              key={item.src.src}
              className={cn(styles.item, item.wide && styles.wide, item.device === "phone" && styles.phoneItem)}
            >
              <figure className={styles.figure}>
                <button
                  type="button"
                  className={styles.zoom}
                  onClick={() => setOpen(i)}
                  aria-label={`${labels.open}: ${item.alt[lang]}`}
                  aria-haspopup="dialog"
                >
                  <ScreenFrame device={item.device}>
                    <Image
                      src={item.src}
                      alt=""
                      placeholder="blur"
                      sizes={
                        item.device === "phone"
                          ? "240px"
                          : item.wide
                            ? "(min-width: 1000px) 66vw, 100vw"
                            : "(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw"
                      }
                      style={{ maxWidth: item.src.width, marginInline: "auto" }}
                    />
                  </ScreenFrame>
                </button>
                <figcaption className={styles.caption}>
                  <span aria-hidden="true">{pad(i + 1)}</span>
                  {item.caption[lang]}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}

      {compare.map((pair) => (
        <BeforeAfter key={pair.after.src.src} pair={pair} labels={labels} lang={lang} />
      ))}

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label={labels.dialog}
        data-lenis-prevent
        onClose={() => {
          setOpen(null);
          getLenis()?.start();
        }}
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={onKeyDown}
      >
        {current && (
          <div className={styles.lbInner}>
            <div className={styles.lbBar}>
              <span className={styles.lbCount} aria-live="polite">
                {pad(open + 1)} {labels.of} {pad(items.length)}
              </span>
              <button type="button" className={styles.lbButton} onClick={close} aria-label={labels.close}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <figure className={styles.lbFigure}>
              <Image
                key={current.src.src}
                src={current.src}
                alt={current.alt[lang]}
                sizes="100vw"
                quality={90}
                className={styles.lbImage}
              />
              <figcaption className={styles.lbCaption}>{current.caption[lang]}</figcaption>
            </figure>
            {items.length > 1 && (
              <div className={styles.lbNav}>
                <button type="button" className={styles.lbButton} onClick={() => step(-1)} aria-label={labels.prev}>
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" className={styles.lbButton} onClick={() => step(1)} aria-label={labels.next}>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

/** Same feature, two versions: a pressed-state toggle swaps the screenshot. */
function BeforeAfter({ pair, labels, lang }) {
  const [after, setAfter] = useState(true);
  const layer = (shot, on) => (
    <Image
      src={shot.src}
      alt={shot.alt[lang]}
      placeholder="blur"
      sizes="(min-width: 1000px) 66vw, 100vw"
      className={cn(styles.layer, on && styles.layerOn)}
      style={{ maxWidth: shot.src.width }}
    />
  );

  return (
    <figure className={styles.compare}>
      <div className={styles.compareHead}>
        <span className={styles.compareLabel}>{pair.label[lang]}</span>
        <div role="group" aria-label={`${labels.compare}: ${pair.label[lang]}`} className={styles.toggle}>
          <button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>
            {labels.before}
          </button>
          <button type="button" aria-pressed={after} onClick={() => setAfter(true)}>
            {labels.after}
          </button>
        </div>
      </div>
      <ScreenFrame label={after ? labels.after : labels.before}>
        <div className={styles.stack}>
          {layer(pair.before, !after)}
          {layer(pair.after, after)}
        </div>
      </ScreenFrame>
      <figcaption className={styles.caption}>{pair.caption[lang]}</figcaption>
    </figure>
  );
}
