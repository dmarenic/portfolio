import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { FilePdf } from "@phosphor-icons/react/dist/ssr/FilePdf";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { contact, profile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { Section } from "@/components/Section/Section";
import styles from "./Contact.module.css";

/*
 * The last section: a dark panel that lies underneath the About panel and is
 * uncovered as About scrolls away. It opens with a large line set like the
 * name in the hero, then the email address and the profile links. Plain
 * links only: a contact form would need a server and attracts spam.
 */
export function Contact({ locale }: { locale: Locale }) {
  // "Javite se" -> "Javite" as an outline, "se" solid in the accent colour,
  // like the first and last name in the hero.
  const words = contact.heading[locale].split(" ");
  const last = words.pop();

  return (
    <Section
      id="contact"
      title={contact.title[locale]}
      tone="dark"
      underneath
      display={
        <>
          <span className={styles.outline}>{words.join(" ")}</span>{" "}
          <span className={styles.highlight}>{last}</span>
        </>
      }
    >
      <div className={styles.body} data-reveal>
        <p className={styles.text}>{contact.text[locale]}</p>
        {/* The address is as wide as the row of buttons under it (see
            Contact.module.css). */}
        <div className={styles.actions}>
          <div className={styles.emailRow}>
            <a className={styles.email} href={`mailto:${profile.email}`}>
              {profile.email}
              <ArrowUpRight size={28} aria-hidden="true" />
            </a>
          </div>
          <ul className={styles.links}>
            <li>
              <ExternalLink
                className="pill"
                href={profile.linkedin}
                locale={locale}
              >
                <LinkedinLogo size={18} aria-hidden="true" />
                LinkedIn
                <ArrowUpRight size={14} aria-hidden="true" data-arrow />
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                className="pill"
                href={profile.github}
                locale={locale}
              >
                <GithubLogo size={18} aria-hidden="true" />
                GitHub
                <ArrowUpRight size={14} aria-hidden="true" data-arrow />
              </ExternalLink>
            </li>
            {profile.cv[locale].map((cv) => (
              <li key={cv.href}>
                <ExternalLink
                  className="pill"
                  href={cv.href}
                  hrefLang={cv.lang}
                  type="application/pdf"
                  locale={locale}
                >
                  <FilePdf size={18} aria-hidden="true" />
                  {cv.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
