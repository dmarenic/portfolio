import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ui } from "@/content/site";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { Projects } from "@/components/Projects/Projects";
import { Skills } from "@/components/Skills/Skills";
import { ExperienceAndEducation } from "@/components/Timeline/Timeline";
import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Dock } from "@/components/Dock/Dock";
import styles from "./page.module.css";

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
        {/* The hero is pinned (sticky) only inside this wrapper: while the
            projects panel slides over it, and not a pixel longer. */}
        <div className={styles.cover}>
          <Hero locale={locale} />
          <Projects locale={locale} />
        </div>
        <Skills locale={locale} />
        <ExperienceAndEducation locale={locale} />
        {/* Contact lies underneath About and is pinned to the bottom of the
            screen only inside this wrapper, while About scrolls away. */}
        <div>
          <About locale={locale} />
          <Contact locale={locale} />
        </div>
      </main>
      <Dock
        label={ui.nav.label[locale]}
        items={ui.nav.items.map((id) => ({
          id,
          label: ui.nav.labels[id][locale],
        }))}
      />
    </>
  );
}
