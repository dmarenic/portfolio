import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/**
 * A page section with its heading in a narrow left column and the content on
 * the right (stacked on narrow screens). The id is the anchor used by the
 * navigation, for example /#projects.
 */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId}>
      <div className="container">
        <div className={styles.grid}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
