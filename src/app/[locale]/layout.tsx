import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl, ui } from "@/content/site";
import { geist, geistMono } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import { themeScript } from "@/lib/theme";
import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Footer/Footer";
import { LinksMenu } from "@/components/LinksMenu/LinksMenu";
import { PointerEffects } from "@/components/PointerEffects/PointerEffects";
import { RevealObserver } from "@/components/RevealObserver/RevealObserver";
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
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* suppressHydrationWarning: some browser extensions (for example
          ColorZilla) add attributes to <body> before React loads. It only
          hides attribute differences on <body> itself, not inside it. */}
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">
          {ui.skipLink[locale]}
        </a>
        {children}
        <Footer locale={locale} />
        <LinksMenu locale={locale} />
        <Chat locale={locale} />
        <PointerEffects />
        <RevealObserver />
      </body>
    </html>
  );
}
