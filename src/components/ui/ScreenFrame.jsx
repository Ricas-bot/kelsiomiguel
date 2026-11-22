import { cn } from "@/lib/utils";
import styles from "./ScreenFrame.module.css";

/**
 * Neutral chrome around a screenshot: a window bar (default) or a phone
 * body (`device="phone"`). Purely presentational; the image inside carries
 * its own alt text.
 */
export default function ScreenFrame({ device = "window", size = "md", label, className, children }) {
  if (device === "phone") {
    return (
      <div className={cn(styles.phone, className)}>
        <div className={styles.phoneScreen}>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn(styles.frame, size === "sm" && styles.sm, className)}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
