import Image from "next/image";
import Link from "next/link";
import { type Project, projects, projectsSection } from "@/content/site";
import { type Locale, localePath } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import { BluePulseDiagram } from "./BluePulseDiagram";
import styles from "./Projects.module.css";

type ProjectArticleProps = {
  project: Project;
  locale: Locale;
  featured: boolean;
};

function ProjectArticle({ project, locale, featured }: ProjectArticleProps) {
  const text = projectsSection;
  const nameId = `${project.id}-name`;

  return (
    <article
      className={`${styles.project} ${featured ? styles.featured : ""}`}
      aria-labelledby={nameId}
    >
      <div>
        <h3 id={nameId} className={styles.name}>
          {project.name}
        </h3>
        <p className={styles.context}>{project.context[locale]}</p>
        <p className={styles.summary}>{project.summary[locale]}</p>

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
      </div>

      <div className={styles.visual}>
        {project.visual.type === "image" ? (
          <Image
            className={styles.screenshot}
            src={project.visual.src}
            width={project.visual.width}
            height={project.visual.height}
            alt={project.visual.alt[locale]}
            sizes="(min-width: 75rem) 34rem, (min-width: 60rem) 40vw, 100vw"
          />
        ) : (
          <BluePulseDiagram locale={locale} />
        )}
      </div>
    </article>
  );
}

export function Projects({ locale }: { locale: Locale }) {
  return (
    <Section id="projects" title={projectsSection.title[locale]}>
      <div className={styles.list}>
        {projects.map((project, index) => (
          <ProjectArticle
            key={project.id}
            project={project}
            locale={locale}
            featured={index === 0}
          />
        ))}
      </div>
    </Section>
  );
}
