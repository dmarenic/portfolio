import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { triviaCaseStudy } from "@/content/trivia-case-study";
import { localePath, locales } from "@/lib/i18n";

// Pages of the site, without the language prefix. Add new pages here.
const pages = ["/", triviaCaseStudy.path];

// Served as /sitemap.xml: every page in every language, each entry listing
// its versions in the other languages.
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localePath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [
            other,
            `${siteUrl}${localePath(other, path)}`,
          ]),
        ),
      },
    })),
  );
}
