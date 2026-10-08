import type { Metadata } from "next";
import { type Locale, localePath } from "@/lib/i18n";

/**
 * Canonical URL and language alternates (hreflang) for a page, so search
 * engines know that /projects/x and /hr/projects/x are the same page in two
 * languages. Relative URLs are resolved against metadataBase in the layout.
 */
export function pageAlternates(
  locale: Locale,
  path: string,
): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: localePath("en", path),
      hr: localePath("hr", path),
      "x-default": localePath("en", path),
    },
  };
}
