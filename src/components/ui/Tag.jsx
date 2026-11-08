import { cn } from "@/lib/utils";
import styles from "./Tag.module.css";

/** Small mono tag for technologies and categories. Server Component. */
export default function Tag({ children, accent = false, className }) {
  return <span className={cn(styles.tag, accent && styles.accent, className)}>{children}</span>;
}

/** Semantic list wrapper for a group of tags. */
export function TagList({ items, label, className }) {
  return (
    <ul className={cn(styles.list, className)} aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
