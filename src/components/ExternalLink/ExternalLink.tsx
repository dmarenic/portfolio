import type { ComponentPropsWithoutRef } from "react";
import { ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";

type ExternalLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "target" | "rel"
> & {
  href: string;
  locale: Locale;
};

/**
 * A link that opens in a new tab. Use it for every link that leaves this
 * site (GitHub, LinkedIn, project demos and code) and for the PDF files, so
 * new links behave the same way without anyone having to remember it.
 * Anchors on the page (#...), pages of this site and mailto: links stay
 * plain <a> or <Link>.
 *
 * - target="_blank" opens the new tab.
 * - rel="noopener noreferrer": the other site cannot reach this page through
 *   window.opener, and it is not told which page the visitor came from.
 * - Screen readers also hear "(opens in a new tab)", because nothing on the
 *   screen says so; the text is hidden visually (.visually-hidden).
 *
 * Every other attribute (className, hrefLang, type...) is passed on as is.
 */
export function ExternalLink({
  locale,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden">{ui.newTab[locale]}</span>
    </a>
  );
}
