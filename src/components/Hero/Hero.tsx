import Image from "next/image";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { FilePdf } from "@phosphor-icons/react/dist/ssr/FilePdf";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { profile, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import styles from "./Hero.module.css";

/*
 * The first screen: the name set very large, the black and white portrait in
 * front of it, a short introduction with two buttons on the left and the
 * profile links on the right. On narrow screens everything stacks: name,
 * portrait, then the text and links.
 */
export function Hero({ locale }: { locale: Locale }) {
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");
  const { portrait } = profile;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.stage}`}>
        {/* Each line sits in its own clipped box, so it can rise into view. */}
        <h1 id="hero-title" className={styles.name}>
          <span className={styles.line}>
            <span className={styles.outline}>{firstName}</span>
          </span>{" "}
          <span className={styles.line}>
            <span>{lastName}</span>
          </span>
        </h1>

        <div className={styles.portrait}>
          <Image
            src={portrait.src}
            width={portrait.width}
            height={portrait.height}
            alt={portrait.alt[locale]}
            sizes="(min-width: 72rem) 44rem, (min-width: 48rem) 60vw, 92vw"
            preload
          />
        </div>

        <div className={styles.intro}>
          <p className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {profile.summary.text[locale]}
          </p>
          <p className={styles.lead}>{profile.summary.lead[locale]}</p>
          <div className={styles.actions}>
            <a className="pill pill-dark" href="#projects" data-magnetic>
              {ui.nav.labels.projects[locale]}
              <ArrowDown size={16} weight="bold" aria-hidden="true" />
            </a>
            <a className="pill" href="#contact">
              {ui.nav.labels.contact[locale]}
            </a>
          </div>
        </div>

        {/* data-hero-links: the links menu in the corner appears only while
            these links are off screen (see LinksMenuToggle). */}
        <ul
          className={styles.links}
          aria-label={ui.nav.profileLinks[locale]}
          data-hero-links
        >
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
    </section>
  );
}
