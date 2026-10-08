import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ui } from "@/content/site";
import { isLocale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/metadata";
import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: ui.meta.homeTitle[locale],
    description: ui.meta.homeDescription[locale],
    alternates: pageAlternates(locale, "/"),
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Header locale={locale} path="/" />
      <main id="main">
        <Hero locale={locale} />
      </main>
    </>
  );
}
