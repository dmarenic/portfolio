import { projects, siteUrl } from "@/content/site";
import { isLocale, locales } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og";

// Preview card for the case study in each language, shown when the link is
// shared on LinkedIn or elsewhere. Built the same way as the home page card.

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Online Trivia Quiz, a project by Dominik Marenić";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const language = isLocale(locale) ? locale : "en";
  // "!": the trivia project is always defined in site.ts.
  const project = projects.find((p) => p.id === "trivia")!;

  return renderOgImage({
    title: project.name,
    subtitle: project.context[language],
    footer: new URL(siteUrl).host,
  });
}
