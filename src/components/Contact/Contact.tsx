import { FilePdf } from "@phosphor-icons/react/dist/ssr/FilePdf";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { contact, profile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import styles from "./Contact.module.css";

/* The last section is a band in the panel colour with the email address set
   large. Plain links only: a contact form would need a server and attracts
   spam. */
export function Contact({ locale }: { locale: Locale }) {
  return (
    <section
      id="contact"
      className={styles.band}
      aria-labelledby="contact-title"
    >
      <div className="container">
        <h2 id="contact-title" className={styles.title}>
          {contact.title[locale]}
        </h2>
        <p className={styles.text}>{contact.text[locale]}</p>
        <a className={styles.email} href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <ul className={styles.links}>
          <li>
            <a href={profile.linkedin}>
              <LinkedinLogo size={20} aria-hidden="true" />
              LinkedIn
            </a>
          </li>
          <li>
            <a href={profile.github}>
              <GithubLogo size={20} aria-hidden="true" />
              GitHub
            </a>
          </li>
          {profile.cv[locale].map((cv) => (
            <li key={cv.href}>
              <a href={cv.href} hrefLang={cv.lang} type="application/pdf">
                <FilePdf size={20} aria-hidden="true" />
                {cv.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
