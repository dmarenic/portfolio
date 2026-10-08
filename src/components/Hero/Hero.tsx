import { profile, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { SequenceDiagram } from "@/components/SequenceDiagram/SequenceDiagram";
import styles from "./Hero.module.css";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <h1 id="hero-title" className={styles.name}>
            {profile.name}
          </h1>
          <p className={styles.role}>{profile.role[locale]}</p>
          <p className={styles.intro}>{profile.intro[locale]}</p>
          <p className={styles.availability}>{profile.availability[locale]}</p>

          <div className={styles.actions}>
            <a
              className={`${styles.button} ${styles.primary}`}
              href="#projects"
            >
              {ui.hero.primaryAction[locale]}
            </a>
            <a className={styles.button} href={`mailto:${profile.email}`}>
              {ui.hero.secondaryAction[locale]}
            </a>
          </div>

          <ul className={styles.links}>
            <li>
              <a href={profile.github}>GitHub</a>
            </li>
            <li>
              <a href={profile.linkedin}>LinkedIn</a>
            </li>
            {profile.cv[locale].map((cv) => (
              <li key={cv.href}>
                <a href={cv.href} hrefLang={cv.lang} type="application/pdf">
                  {cv.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <SequenceDiagram locale={locale} />
      </div>
    </section>
  );
}
