import Image from "next/image";
import { about, profile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import styles from "./About.module.css";

/* The photo on the left, the heading and text on the right. This section
   uses its own layout instead of <Section>, so the heading can sit next to
   the photo. */
export function About({ locale }: { locale: Locale }) {
  const { photo } = profile;

  return (
    <section id="about" aria-labelledby="about-title">
      <div className="container">
        <div className={styles.grid}>
          {photo && (
            <Image
              className={styles.photo}
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt[locale]}
              sizes="(min-width: 60rem) 28rem, 90vw"
            />
          )}
          <div className={styles.text}>
            <h2 id="about-title" className={styles.title}>
              {about.title[locale]}
            </h2>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.en}>{paragraph[locale]}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
