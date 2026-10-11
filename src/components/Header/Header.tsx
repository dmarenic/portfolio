import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
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

/* The top bar: name on the left, the "looking for work" status in the
   middle, language, theme and the contact button on the right. It scrolls
   away with the page; on the home page the floating Dock is the navigation. */
export function Header({ locale, path }: HeaderProps) {
  const home = localePath(locale);
  const otherLocale = locales.find((l) => l !== locale) ?? locale;
  const languageLink = ui.languageSwitch[locale];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* A plain link, like the others on the site: a full page load with
            the cross-fade. next/link would prefetch "/" as React Server
            Component data, which fails (404) because English is rewritten
            from / to /en. */}
        <a
          href={home}
          className={styles.home}
          aria-label={ui.nav.homeLink[locale]}
        >
          {profile.name}
        </a>

        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {profile.summary.text[locale]}
        </p>

        <div className={styles.tools}>
          <a
            className={`pill ${styles.language}`}
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
          {/* "/#contact" scrolls on the home page and navigates from other pages. */}
          <a
            className={`pill pill-dark ${styles.contact}`}
            href={`${home}#contact`}
          >
            {ui.nav.labels.contact[locale]}
            <ArrowUpRight
              size={16}
              weight="bold"
              aria-hidden="true"
              data-arrow
            />
          </a>
        </div>
      </div>
    </header>
  );
}
