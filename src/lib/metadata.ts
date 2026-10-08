import type { Metadata } from "next";
import { profile } from "@/content/site";
import { type Locale, localePath } from "@/lib/i18n";

type PageMetadataInput = {
  locale: Locale;
  // Path of the page without the language prefix, for example "/".
  path: string;
  title: string;
  description: string;
};

/**
 * Title, description, canonical URL, language alternates (hreflang) and Open
 * Graph tags for a page. hreflang tells search engines that /projects/x and
 * /hr/projects/x are the same page in two languages. Relative URLs are
 * resolved against metadataBase in the layout; the Open Graph image comes
 * from the opengraph-image file next to the page.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        en: localePath("en", path),
        hr: localePath("hr", path),
        "x-default": localePath("en", path),
      },
    },
    openGraph: {
      type: "website",
      url: localePath(locale, path),
      siteName: profile.name,
      title,
      description,
      locale: locale === "hr" ? "hr_HR" : "en_US",
    },
  };
}
