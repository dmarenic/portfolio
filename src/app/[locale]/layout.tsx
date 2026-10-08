import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl, ui } from "@/content/site";
import { archivo, jetbrainsMono } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import { themeScript } from "@/lib/theme";
import "../globals.css";

// Build a static version of every page for each language. Any other value in
// the [locale] segment (for example /de) is not generated and returns a 404.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    // suppressHydrationWarning: themeScript may add data-theme to <html>
    // before React hydrates, which is expected and not an error.
    <html
      lang={locale}
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {ui.skipLink[locale]}
        </a>
        {children}
      </body>
    </html>
  );
}
