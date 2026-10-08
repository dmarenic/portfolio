import Image from "next/image";
import Link from "next/link";
import { type Project, projects, projectsSection } from "@/content/site";
import { type Locale, localePath } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import { BluePulseDiagram } from "./BluePulseDiagram";
import styles from "./Projects.module.css";

/*
 * The first project (the thesis) is featured: a wide screenshot with a text
 * panel overlapping its lower edge. The other projects sit side by side below
 * it, each with its visual on top.
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

  return (
    <>
      <ul className={styles.highlights}>
        {project.highlights.map((highlight) => (
          <li key={highlight.en}>{highlight[locale]}</li>
        ))}
      </ul>

      <p className={styles.stack}>
        <span className={styles.stackLabel}>{text.stackLabel[locale]}</span>{" "}
        {project.stack.join(", ")}
      </p>

      <ul className={styles.links}>
        {project.links.caseStudy && (
          <li>
            <Link
              className={styles.primaryLink}
              href={localePath(locale, project.links.caseStudy)}
            >
              {text.links.caseStudy[locale]}
            </Link>
          </li>
        )}
        {project.links.demo && (
          <li>
            <a href={project.links.demo}>{text.links.demo[locale]}</a>
          </li>
        )}
        <li>
          <a href={project.links.code}>{text.links.code[locale]}</a>
        </li>
      </ul>
      {project.demoNote && (
        <p className={styles.note}>{project.demoNote[locale]}</p>
      )}
    </>
  );
}

function ProjectVisual({
  project,
  locale,
  sizes,
  className,
}: ProjectProps & { sizes: string; className: string }) {
  if (project.visual.type === "diagram") {
    return <BluePulseDiagram locale={locale} />;
  }
  return (
    <Image
      className={className}
      src={project.visual.src}
      width={project.visual.width}
      height={project.visual.height}
      alt={project.visual.alt[locale]}
      sizes={sizes}
    />
  );
}

export function Projects({ locale }: { locale: Locale }) {
  const [featured, ...others] = projects;

  return (
    <Section id="projects" title={projectsSection.title[locale]}>
      <article
        className={styles.featured}
        aria-labelledby={`${featured.id}-name`}
      >
        <ProjectVisual
          project={featured}
          locale={locale}
          className={styles.featuredImage}
          sizes="(min-width: 80rem) 76rem, 100vw"
        />
        <div className={styles.featuredPanel}>
          <div>
            <ProjectIntro project={featured} locale={locale} />
          </div>
          <div>
            <ProjectFacts project={featured} locale={locale} />
          </div>
        </div>
      </article>

      <div className={styles.others}>
        {others.map((project) => (
          <article
            key={project.id}
            className={styles.project}
            aria-labelledby={`${project.id}-name`}
          >
            <ProjectVisual
              project={project}
              locale={locale}
              className={styles.image}
              sizes="(min-width: 60rem) 37rem, 100vw"
            />
            <div className={styles.projectText}>
              <ProjectIntro project={project} locale={locale} />
              <ProjectFacts project={project} locale={locale} />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
