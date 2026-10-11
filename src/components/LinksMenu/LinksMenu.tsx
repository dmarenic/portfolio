import type { CSSProperties, ReactNode } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { FilePdf } from "@phosphor-icons/react/dist/ssr/FilePdf";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { profile, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { LinksMenuToggle } from "./LinksMenuToggle";
import styles from "./LinksMenu.module.css";

/*
 * The round button in the bottom left corner. It opens a column of round
 * icons with a label next to each: the same links as in the hero (GitHub,
 * LinkedIn, email and the CVs), so it only appears once the hero links are
 * off screen (see LinksMenuToggle).
 *
 * The links are rendered here, on the server, and handed to the toggle as
 * children. That way ExternalLink and the content of site.ts stay out of the
 * JavaScript sent to the browser; only the opening and closing runs there.
 */
export function LinksMenu({ locale }: { locale: Locale }) {
  return (
    <LinksMenuToggle label={ui.linksMenu.label[locale]}>
      <Item index={0}>
        <ExternalLink
          className={styles.link}
          href={profile.github}
          locale={locale}
        >
          <Content icon={<GithubLogo size={20} aria-hidden="true" />}>
            GitHub
          </Content>
        </ExternalLink>
      </Item>
      <Item index={1}>
        <ExternalLink
          className={styles.link}
          href={profile.linkedin}
          locale={locale}
        >
          <Content icon={<LinkedinLogo size={20} aria-hidden="true" />}>
            LinkedIn
          </Content>
        </ExternalLink>
      </Item>
      <Item index={2}>
        {/* mailto: opens the mail app, not a page, so it stays a plain link. */}
        <a className={styles.link} href={`mailto:${profile.email}`}>
          <Content icon={<EnvelopeSimple size={20} aria-hidden="true" />}>
            {ui.linksMenu.email[locale]}
          </Content>
        </a>
      </Item>
      {profile.cv[locale].map((cv, index) => (
        <Item key={cv.href} index={3 + index}>
          <ExternalLink
            className={styles.link}
            href={cv.href}
            hrefLang={cv.lang}
            type="application/pdf"
            locale={locale}
          >
            <Content icon={<FilePdf size={20} aria-hidden="true" />}>
              {cv.label}
            </Content>
          </ExternalLink>
        </Item>
      ))}
    </LinksMenuToggle>
  );
}

// --i is the position counted from the button; the CSS uses it to show the
// icons one after another.
function Item({ index, children }: { index: number; children: ReactNode }) {
  return (
    <li className={styles.item} style={{ "--i": index } as CSSProperties}>
      {children}
    </li>
  );
}

// A round icon with the name of the link in a pill next to it.
function Content({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{children}</span>
    </>
  );
}
