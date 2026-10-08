import { education, experience } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import styles from "./Timeline.module.css";

/* Experience and education share one layout: the period on the left, the
   details on the right. */

export function Experience({ locale }: { locale: Locale }) {
  return (
    <Section id="experience" title={experience.title[locale]}>
      <ol className={styles.list}>
        {experience.items.map((item) => (
          <li key={item.organization} className={styles.item}>
            <p className={styles.period}>{item.period[locale]}</p>
            <div>
              <h3 className={styles.heading}>
                {item.role[locale]}, {item.organization}
              </h3>
              <p className={styles.meta}>{item.place}</p>
              <p className={styles.text}>{item.description[locale]}</p>
              <p className={styles.meta}>{item.stack.join(", ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Education({ locale }: { locale: Locale }) {
  return (
    <Section id="education" title={education.title[locale]}>
      <ol className={styles.list}>
        {education.items.map((item) => (
          <li key={item.school.en} className={styles.item}>
            <p className={styles.period}>{item.period[locale]}</p>
            <div>
              <h3 className={styles.heading}>{item.programme[locale]}</h3>
              <p className={styles.meta}>{item.school[locale]}</p>
              <p className={styles.text}>{item.degree[locale]}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
