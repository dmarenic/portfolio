import { bluePulseArchitecture } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import styles from "./Projects.module.css";

/**
 * Architecture of the Blue Pulse Android app as boxes and arrows, used instead
 * of a screenshot. Each layer only talks to the one below it; the repository
 * decides which data source to use.
 */
export function BluePulseDiagram({ locale }: { locale: Locale }) {
  const { layers, sources, caption } = bluePulseArchitecture;

  return (
    <figure className={styles.architecture}>
      <ol className={styles.layers}>
        {layers.map((layer) => (
          <li key={layer.name} className={styles.layer}>
            <span className={styles.layerName}>{layer.name}</span>
            <span className={styles.layerRole}>{layer.role[locale]}</span>
          </li>
        ))}
      </ol>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.name} className={styles.layer}>
            <span className={styles.layerName}>{source.name}</span>
            <span className={styles.layerRole}>{source.role[locale]}</span>
          </li>
        ))}
      </ul>
      <figcaption className={styles.architectureCaption}>
        {caption[locale]}
      </figcaption>
    </figure>
  );
}
