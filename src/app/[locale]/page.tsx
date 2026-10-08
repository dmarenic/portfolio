import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ui } from "@/content/site";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { Projects } from "@/components/Projects/Projects";
import { Skills } from "@/components/Skills/Skills";
import { Education, Experience } from "@/components/Timeline/Timeline";
import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return pageMetadata({
    locale,
    path: "/",
    title: ui.meta.homeTitle[locale],
    description: ui.meta.homeDescription[locale],
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Header locale={locale} path="/" />
      <main id="main">
        <Hero locale={locale} />
        <Projects locale={locale} />
        <Skills locale={locale} />
        <Experience locale={locale} />
        <Education locale={locale} />
        <About locale={locale} />
        <Contact locale={locale} />
      </main>
    </>
  );
}
