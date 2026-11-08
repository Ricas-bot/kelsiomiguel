import Link from "next/link";
import { cn, isExternalHref } from "@/lib/utils";
import styles from "./Button.module.css";

/**
 * Polymorphic button/link.
 *  - `href` internal  → next/link
 *  - `href` external  → <a target="_blank" rel="noopener noreferrer">
 *  - no `href`        → <button type="button">
 *
 * Variants: "primary" (lime fill), "outline", "link" (underlined text).
 * Sizes: "md" (default), "sm".
 * `icon` renders after the label and nudges on hover.
 * Data attribute `data-cursor` is forwarded for the custom cursor (Phase 4).
 */
export default function Button({
  href,
  variant = "outline",
  size = "md",
  icon,
  className,
  children,
  external,
  ...rest
}) {
  const classes = cn(styles.button, styles[variant], styles[size], className);
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <button type="button" className={classes} {...rest}>
        {content}
      </button>
    );
  }

  const isExternal = external ?? isExternalHref(href);
  if (isExternal) {
    const opensNewTab = /^(https?:)?\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(opensNewTab && { target: "_blank", rel: "noopener noreferrer" })}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
