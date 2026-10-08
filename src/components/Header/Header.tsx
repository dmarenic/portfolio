import Link from "next/link";
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
            {ui.nav.items.map((item) => (
              <li key={item.href}>
                {/* "/#projects" scrolls on the home page and navigates from other pages. */}
                <a href={`${home}${item.href}`}>{item.label[locale]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.tools}>
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
