/**
 * Languages the site is published in. English is the default and lives at the
 * root of the site (/), Croatian lives under /hr.
 *
 * Internally every page sits under the `[locale]` route segment. next.config.ts
 * rewrites the English URLs (/ and /projects/...) to /en/..., so visitors never
 * see the /en prefix.
 */
export const locales = ["en", "hr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** A piece of content written in every supported language. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Builds the public URL path of a page in the given language.
 *
 * localePath("en", "/")         -> "/"
 * localePath("hr", "/")         -> "/hr"
 * localePath("hr", "/projects") -> "/hr/projects"
 */
export function localePath(locale: Locale, path = "/"): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** The path of the same page with the language prefix removed. */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`))
      return pathname.slice(locale.length + 1);
  }
  return pathname;
}
