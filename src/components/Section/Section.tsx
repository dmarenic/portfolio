import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  title: string;
  /**
   * "stacked": heading above the content, using the full width.
   * "rail": heading (and `aside`) in a narrow left column that stays in view
   * while the content on the right scrolls.
   */
  layout?: "stacked" | "rail";
  aside?: ReactNode;
  children: ReactNode;
};

/** A page section. The id is the anchor used by the navigation (/#projects). */
export function Section({
  id,
  title,
  layout = "stacked",
  aside,
  children,
}: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId}>
      <div className="container">
        <div className={layout === "rail" ? styles.rail : styles.stacked}>
          <div className={styles.side}>
            <h2 id={headingId} className={styles.title}>
              {title}
            </h2>
            {aside}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
