import { triviaCaseStudy } from "@/content/trivia-case-study";
import type { Locale } from "@/lib/i18n";
import styles from "./ArchitectureDiagram.module.css";

/**
 * Architecture of Online Trivia Quiz as boxes and arrows: browser, Next.js on
 * Vercel, NestJS on Render, Prisma and PostgreSQL from top to bottom, and the
 * Google Gemini API to the side of NestJS. It is an ordered list, so screen
 * readers read the boxes in the same order; the lines and arrowheads are
 * drawn by CSS.
 */
export function ArchitectureDiagram({ locale }: { locale: Locale }) {
  const d = triviaCaseStudy.architecture.diagram;

  return (
    <figure className={styles.figure} aria-label={d.label[locale]}>
      <ol className={styles.flow}>
        <li className={styles.node}>
          <span className={styles.name}>{d.browser[locale]}</span>
        </li>
        <li className={styles.link} aria-hidden="true" />
        <li className={styles.node}>
          <span className={styles.name}>{d.frontend.name}</span>
          <span className={styles.note}>{d.frontend.host}</span>
        </li>
        <li className={styles.link}>
          <span className={styles.linkLabel}>{d.transport}</span>
        </li>
        <li className={`${styles.node} ${styles.backend}`}>
          <span className={styles.name}>{d.backend.name}</span>
          <span className={styles.note}>{d.backend.host}</span>
        </li>
        <li className={`${styles.node} ${styles.side}`}>
          <span className={styles.name}>{d.ai.name}</span>
          <span className={styles.note}>{d.ai.role[locale]}</span>
        </li>
        <li className={styles.link}>
          <span className={styles.linkLabel}>{d.orm}</span>
        </li>
        <li className={styles.node}>
          <span className={styles.name}>{d.database}</span>
        </li>
      </ol>
    </figure>
  );
}
