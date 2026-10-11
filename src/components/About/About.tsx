import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { about, profile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import styles from "./About.module.css";

/**
 * Turns the words between asterisks into highlighted words (<mark>), like
 * withCode does with backticks: "the *gym*" -> the <mark>gym</mark>.
 * Splitting on the asterisk gives the plain text at even positions and the
 * highlighted words at odd positions.
 */
function withHighlights(text: string): ReactNode {
  return text
    .split("*")
    .map((part, index) =>
      index % 2 === 1 ? (
        <mark key={index}>{part}</mark>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}

/* The photo on the left, the text on the right. This is the last light
   panel: its bottom corners are rounded, and the contact section lies
   underneath it. */
export function About({ locale }: { locale: Locale }) {
  const { photo } = profile;

  return (
    <Section id="about" title={about.title[locale]} roundBottom>
      <div className={styles.grid}>
        {photo && (
          <Image
            data-reveal
            className={styles.photo}
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt[locale]}
            sizes="(min-width: 60rem) 28rem, 90vw"
          />
        )}
        <div className={styles.text}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.en} data-reveal>
              {paragraph[locale]}
            </p>
          ))}
          <p className={styles.statement} data-reveal>
            {withHighlights(about.statement[locale])}
          </p>
        </div>
      </div>
    </Section>
  );
}
