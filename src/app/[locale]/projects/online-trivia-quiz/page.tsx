import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { profile, projects, projectsSection, ui } from "@/content/site";
import { triviaCaseStudy } from "@/content/trivia-case-study";
import { isLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { Header } from "@/components/Header/Header";
import { Section } from "@/components/Section/Section";
import { SequenceDiagram } from "@/components/SequenceDiagram/SequenceDiagram";
import { ArchitectureDiagram } from "@/components/CaseStudy/ArchitectureDiagram";
import { withCode } from "@/components/CaseStudy/withCode";
import styles from "./page.module.css";

/*
 * The case study of my bachelor's thesis project. It is built from the same
 * pieces as the home page: a light opening part with the name set large,
 * then panels that alternate dark and light and slide over each other. The
 * last panel has rounded bottom corners, and the dark footer lies under it.
 */

// "!" tells TypeScript that find always returns a project here: the trivia
// project is defined in site.ts.
const project = projects.find((p) => p.id === "trivia")!;
const text = triviaCaseStudy;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/online-trivia-quiz">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return pageMetadata({
    locale,
    path: text.path,
    title: `${project.name} | ${profile.name}`,
    description: project.summary[locale],
  });
}

export default async function TriviaCaseStudyPage({
  params,
}: PageProps<"/[locale]/projects/online-trivia-quiz">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // "Online Trivia Quiz" -> "Online Trivia" as an outline, "Quiz" solid,
  // like the first and last name in the hero of the home page.
  const words = project.name.split(" ");
  const last = words.pop();

  return (
    <>
      <Header locale={locale} path={text.path} />
      <main id="main">
        <div className={`container ${styles.intro}`}>
          <a className="pill" href={`${localePath(locale)}#projects`}>
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            {ui.nav.labels.projects[locale]}
          </a>

          <h1 className={styles.title}>
            <span className={styles.outline}>{words.join(" ")}</span>{" "}
            <span>{last}</span>
          </h1>

          <div className={styles.introGrid}>
            <div>
              <p className={styles.context}>{project.context[locale]}</p>
              <p className={styles.lead}>{text.intro[locale]}</p>
              <ul className={styles.links}>
                {project.links.demo && (
                  <li>
                    <ExternalLink
                      className="pill pill-dark"
                      href={project.links.demo}
                      locale={locale}
                    >
                      {projectsSection.links.demo[locale]}
                      <ArrowUpRight size={14} aria-hidden="true" data-arrow />
                    </ExternalLink>
                  </li>
                )}
                <li>
                  <ExternalLink
                    className="pill"
                    href={project.links.code}
                    locale={locale}
                  >
                    {projectsSection.links.code[locale]}
                    <ArrowUpRight size={14} aria-hidden="true" data-arrow />
                  </ExternalLink>
                </li>
              </ul>
              {project.demoNote && (
                <p className={styles.note}>{project.demoNote[locale]}</p>
              )}
            </div>

            {/* Starts only when the visitor presses play. */}
            <video
              className={styles.video}
              controls
              playsInline
              preload="none"
              poster={text.video.poster}
              width={text.video.width}
              height={text.video.height}
              aria-label={text.video.label[locale]}
            >
              <source src={text.video.src} type="video/mp4" />
            </video>
          </div>
        </div>

        <Section
          id="what-it-does"
          title={text.whatItDoes.title[locale]}
          tone="dark"
        >
          <div className={styles.columns}>
            {text.whatItDoes.paragraphs.map((paragraph) => (
              <p key={paragraph.en} data-reveal>
                {paragraph[locale]}
              </p>
            ))}
          </div>
          <ul className={styles.gallery}>
            {text.screenshots.map((shot) => (
              <li key={shot.src} data-reveal>
                <figure>
                  <div className={styles.frame}>
                    <Image
                      src={shot.src}
                      width={shot.width}
                      height={shot.height}
                      alt={shot.alt[locale]}
                      sizes="(min-width: 60rem) 38rem, 92vw"
                    />
                  </div>
                  <figcaption className={styles.caption}>
                    {shot.caption[locale]}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="hard-part" title={text.hardPart.title[locale]}>
          <p className={styles.statement} data-reveal>
            {text.hardPart.text[locale]}
          </p>
        </Section>

        <Section
          id="architecture"
          title={text.architecture.title[locale]}
          tone="dark"
        >
          <div className={styles.architecture}>
            <div className={styles.prose}>
              {text.architecture.intro.map((paragraph) => (
                <p key={paragraph.en} data-reveal>
                  {paragraph[locale]}
                </p>
              ))}
              <dl className={styles.channels}>
                {text.architecture.channels.map((channel) => (
                  <div key={channel.name} data-row>
                    <dt>{channel.name}</dt>
                    <dd>{channel.text[locale]}</dd>
                  </div>
                ))}
              </dl>
              <p data-reveal>{withCode(text.architecture.state[locale])}</p>
            </div>
            <div data-reveal>
              <ArchitectureDiagram locale={locale} />
            </div>
          </div>
          <div className={styles.protocol} data-reveal>
            <SequenceDiagram locale={locale} />
          </div>
        </Section>

        <Section id="challenges" title={text.challenges.title[locale]}>
          <ol className={styles.rows}>
            {text.challenges.items.map((item) => (
              <li key={item.title.en} className={styles.row} data-row>
                <h3 className={styles.rowTitle}>{item.title[locale]}</h3>
                <p className={styles.rowText}>{withCode(item.text[locale])}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="learned" title={text.learned.title[locale]} tone="dark">
          <p className={styles.statement} data-reveal>
            {text.learned.text[locale]}
          </p>
        </Section>

        <Section
          id="built-with"
          title={text.builtWith.title[locale]}
          roundBottom
        >
          <dl className={styles.rows}>
            {text.builtWith.rows.map((row) => (
              <div key={row.label.en} className={styles.row} data-row>
                <dt className={styles.rowTitle}>{row.label[locale]}</dt>
                <dd className={styles.rowText}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </main>
    </>
  );
}
