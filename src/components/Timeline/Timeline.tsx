import { education, experience, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import styles from "./Timeline.module.css";

/*
 * Work experience and education as rows separated by thin lines: on the left
 * who (company or school) and the role, in the middle what it was about, on
 * the right when. data-row makes the rows slide in one after another (see
 * the motion system in globals.css).
 */
export function ExperienceAndEducation({ locale }: { locale: Locale }) {
  return (
    <Section
      id="experience"
      title={ui.nav.labels.experience[locale]}
      meta={education.items[0].period[locale]}
      tone="dark"
    >
      <h3 className={styles.groupTitle}>{experience.title[locale]}</h3>
      <ol className={styles.list}>
        {experience.items.map((item) => (
          <li key={item.organization} className={styles.row} data-row>
            <div className={styles.who}>
              <h4 className={styles.name}>{item.organization}</h4>
              <p className={styles.role}>{item.role[locale]}</p>
              <p className={styles.place}>{item.place}</p>
            </div>
            <div className={styles.what}>
              <p>{item.description[locale]}</p>
              <ul className={`tags ${styles.tags}`}>
                {item.stack.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
            <p className={styles.period}>{item.period[locale]}</p>
          </li>
        ))}
      </ol>

      <h3 id="education" className={styles.groupTitle}>
        {education.title[locale]}
      </h3>
      <ol className={styles.list}>
        {education.items.map((item) => (
          <li key={item.school.en} className={styles.row} data-row>
            <div className={styles.who}>
              <h4 className={styles.name}>{item.programme[locale]}</h4>
              <p className={styles.place}>{item.school[locale]}</p>
            </div>
            {item.degree && (
              <div className={styles.what}>
                <p>{item.degree[locale]}</p>
              </div>
            )}
            <p className={styles.period}>{item.period[locale]}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
