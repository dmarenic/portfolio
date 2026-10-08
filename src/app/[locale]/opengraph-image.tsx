import { profile, siteUrl } from "@/content/site";
import { isLocale, locales } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og";

// Preview card for the home page in each language, served at
// /en/opengraph-image and /hr/opengraph-image.

// One image per language, generated at build time.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Dominik Marenić, junior backend and full stack developer";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const language = isLocale(locale) ? locale : "en";

  return renderOgImage({
    title: profile.name,
    subtitle: profile.role[language],
    footer: new URL(siteUrl).host,
  });
}
