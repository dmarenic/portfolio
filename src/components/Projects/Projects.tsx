import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { type Project, projects, projectsSection, ui } from "@/content/site";
import { type Locale, localePath } from "@/lib/i18n";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { Section } from "@/components/Section/Section";
import styles from "./Projects.module.css";

/*
 * The thesis project has its own full-width card: the text and a screenshot
 * side by side. The other projects share a grid of two columns (one on
 * phones), each card with its visual on top.
 */

type ProjectProps = { project: Project; locale: Locale };

function ProjectIntro({ project, locale }: ProjectProps) {
  return (
    <>
      <h3 id={`${project.id}-name`} className={styles.name}>
        {project.name}
      </h3>
      <p className={styles.context}>{project.context[locale]}</p>
      <p className={styles.summary}>{project.summary[locale]}</p>
    </>
  );
}

function ProjectFacts({ project, locale }: ProjectProps) {
  const text = projectsSection;
  const stackId = `${project.id}-stack`;

  return (
    <>
      <ul className={styles.highlights}>
        {project.highlights.map((highlight) => (
          <li key={highlight.en}>{highlight[locale]}</li>
        ))}
      </ul>

      <p id={stackId} className={styles.stackLabel}>
        {text.stackLabel[locale]}
      </p>
      <ul className="tags" aria-labelledby={stackId}>
        {project.stack.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>

      <ul className={styles.links}>
        {project.links.caseStudy && (
          <li>
            <Link
              className="pill pill-dark"
              href={localePath(locale, project.links.caseStudy)}
            >
              {text.links.caseStudy[locale]}
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </li>
        )}
        {project.links.demo && (
          <li>
            <ExternalLink
              className="pill"
              href={project.links.demo}
              locale={locale}
            >
              {text.links.demo[locale]}
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
            {text.links.code[locale]}
            <ArrowUpRight size={14} aria-hidden="true" data-arrow />
          </ExternalLink>
        </li>
      </ul>
    </>
  );
}

/* A note about the demo (for example that it needs time to wake up). It is
   always the last line of the project card, under the links. */
function ProjectNote({ project, locale }: ProjectProps) {
  if (!project.demoNote) return null;
  return <p className={styles.note}>{project.demoNote[locale]}</p>;
}

/* A screenshot in a frame that clips it (the frame keeps its size while the
   picture grows a little on hover). An upright phone screenshot (fit
   "contain") is shown whole, centred in the frame. */
function ProjectVisual({
  project,
  locale,
  sizes,
}: ProjectProps & { sizes: string }) {
  return (
    <div
      className={
        project.visual.fit === "contain"
          ? `${styles.media} ${styles.contain}`
          : styles.media
      }
    >
      <Image
        src={project.visual.src}
        width={project.visual.width}
        height={project.visual.height}
        alt={project.visual.alt[locale]}
        // A whole upright screenshot is only about 40% as wide as the frame.
        sizes={
          project.visual.fit === "contain"
            ? "(min-width: 60rem) 15rem, 40vw"
            : sizes
        }
      />
    </div>
  );
}

export function Projects({ locale }: { locale: Locale }) {
  const [featured, ...others] = projects;

  return (
    <Section
      id="projects"
      title={ui.nav.labels.projects[locale]}
      meta={`(${String(projects.length).padStart(2, "0")})`}
      tone="dark"
    >
      <article
        className={`${styles.card} ${styles.featured}`}
        aria-labelledby={`${featured.id}-name`}
        data-reveal
      >
        <div className={styles.featuredTop}>
          <div className={styles.featuredText}>
            <ProjectIntro project={featured} locale={locale} />
            <ProjectFacts project={featured} locale={locale} />
          </div>
          <ProjectVisual
            project={featured}
            locale={locale}
            sizes="(min-width: 72rem) 40rem, 92vw"
          />
        </div>
        <ProjectNote project={featured} locale={locale} />
      </article>

      <div className={styles.grid}>
        {others.map((project) => (
          <article
            key={project.id}
            className={`${styles.card} ${styles.project}`}
            aria-labelledby={`${project.id}-name`}
            data-reveal
          >
            <ProjectVisual
              project={project}
              locale={locale}
              sizes="(min-width: 60rem) 37rem, 92vw"
            />
            <div className={styles.projectText}>
              <ProjectIntro project={project} locale={locale} />
              <ProjectFacts project={project} locale={locale} />
              <ProjectNote project={project} locale={locale} />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
