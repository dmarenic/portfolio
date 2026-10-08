import { education, experience, experienceSection } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import styles from "./Timeline.module.css";

/* Work experience and education side by side in one section: each has a
   single entry, so two full sections would be mostly empty space. */
export function ExperienceAndEducation({ locale }: { locale: Locale }) {
  return (
    <Section id="experience" title={experienceSection.title[locale]}>
      <div className={styles.columns}>
        <div>
          <h3 className={styles.columnTitle}>{experience.title[locale]}</h3>
          <ol className={styles.list}>
            {experience.items.map((item) => (
              <li key={item.organization} className={styles.item}>
                <p className={styles.period}>{item.period[locale]}</p>
                <h4 className={styles.heading}>
                  {item.role[locale]}, {item.organization}
                </h4>
                <p className={styles.meta}>{item.place}</p>
                <p className={styles.text}>{item.description[locale]}</p>
                <p className={styles.meta}>{item.stack.join(", ")}</p>
              </li>
            ))}
          </ol>
        </div>

        <div id="education">
          <h3 className={styles.columnTitle}>{education.title[locale]}</h3>
          <ol className={styles.list}>
            {education.items.map((item) => (
              <li key={item.school.en} className={styles.item}>
                <p className={styles.period}>{item.period[locale]}</p>
                <h4 className={styles.heading}>{item.programme[locale]}</h4>
                <p className={styles.meta}>{item.school[locale]}</p>
                <p className={styles.text}>{item.degree[locale]}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
