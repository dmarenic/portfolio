import { profile, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { SequenceDiagram } from "@/components/SequenceDiagram/SequenceDiagram";
import styles from "./Hero.module.css";

/* The hero is one moment: name, two short sentences and two buttons on the
   left, the live diagram of the thesis project on the right. Links to GitHub,
   LinkedIn and the CV live in the header and the contact section. */
export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <h1 id="hero-title" className={styles.name}>
            {profile.name}
          </h1>
          <p className={styles.summary}>
            <span className={styles.lead}>{profile.summary.lead[locale]}</span>{" "}
            {profile.summary.text[locale]}
          </p>

          <div className={styles.actions}>
            <a
              className={`${styles.button} ${styles.primary}`}
              href="#projects"
            >
              {ui.nav.labels.projects[locale]}
            </a>
            <a className={styles.button} href="#contact">
              {ui.nav.labels.contact[locale]}
            </a>
          </div>
        </div>

        <SequenceDiagram locale={locale} />
      </div>
    </section>
  );
}
