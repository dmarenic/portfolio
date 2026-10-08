import Link from "next/link";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { profile, ui } from "@/content/site";
import { type Locale, localePath, locales } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import styles from "./Header.module.css";

type HeaderProps = {
  locale: Locale;
  // Path of the current page without the language prefix ("/" for the home
  // page). The language link uses it to point to the same page in the other
  // language.
  path: string;
};

export function Header({ locale, path }: HeaderProps) {
  const home = localePath(locale);
  const otherLocale = locales.find((l) => l !== locale) ?? locale;
  const languageLink = ui.languageSwitch[locale];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link
          href={home}
          className={styles.home}
          aria-label={ui.nav.homeLink[locale]}
        >
          {profile.name}
        </Link>

        <nav className={styles.nav} aria-label={ui.nav.label[locale]}>
          <ul className={styles.navList}>
            {ui.nav.items.map((id) => (
              <li key={id}>
                {/* "/#projects" scrolls on the home page and navigates from other pages. */}
                <a href={`${home}#${id}`}>{ui.nav.labels[id][locale]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.tools}>
          <a
            className={styles.iconLink}
            href={profile.github}
            aria-label={ui.social.github[locale]}
            title={ui.social.github[locale]}
          >
            <GithubLogo size={22} aria-hidden="true" />
          </a>
          <a
            className={styles.iconLink}
            href={profile.linkedin}
            aria-label={ui.social.linkedin[locale]}
            title={ui.social.linkedin[locale]}
          >
            <LinkedinLogo size={22} aria-hidden="true" />
          </a>
          <a
            className={styles.language}
            href={localePath(otherLocale, path)}
            hrefLang={languageLink.lang}
            lang={languageLink.lang}
          >
            {languageLink.label}
          </a>
          <ThemeToggle
            labels={{
              toLight: ui.theme.toLight[locale],
              toDark: ui.theme.toDark[locale],
              unknown: ui.theme.unknown[locale],
            }}
          />
        </div>
      </div>
    </header>
  );
}
