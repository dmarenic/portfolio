import { contact, profile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import styles from "./Contact.module.css";

/* Plain links only: a contact form would need a server and attracts spam. */
export function Contact({ locale }: { locale: Locale }) {
  return (
    <Section id="contact" title={contact.title[locale]}>
      <p className={styles.text}>{contact.text[locale]}</p>
      <a className={styles.email} href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <ul className={styles.links}>
        <li>
          <a href={profile.linkedin}>LinkedIn</a>
        </li>
        <li>
          <a href={profile.github}>GitHub</a>
        </li>
        {profile.cv[locale].map((cv) => (
          <li key={cv.href}>
            <a href={cv.href} hrefLang={cv.lang} type="application/pdf">
              {cv.label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
