import Image from "next/image";
import { about, profile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import styles from "./About.module.css";

export function About({ locale }: { locale: Locale }) {
  const { photo } = profile;

  return (
    <Section id="about" title={about.title[locale]}>
      <div className={styles.grid}>
        <div className={styles.text}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.en}>{paragraph[locale]}</p>
          ))}
        </div>
        {photo && (
          <Image
            className={styles.photo}
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt[locale]}
            sizes="(min-width: 60rem) 20rem, 90vw"
          />
        )}
      </div>
    </Section>
  );
}
