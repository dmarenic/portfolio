import { projects, skills } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/Section/Section";
import styles from "./Skills.module.css";

/* The skill lists sit under the heading in the left column; the matrix on the
   right shows where each technology appears in the projects. */
export function Skills({ locale }: { locale: Locale }) {
  const { comfortable, basics, matrix } = skills;

  const lists = (
    <div className={styles.groups}>
      {[comfortable, basics].map((group) => (
        <div key={group.label.en}>
          <h3 className={styles.groupTitle}>{group.label[locale]}</h3>
          <ul className={styles.tags}>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <Section
      id="skills"
      title={skills.title[locale]}
      layout="rail"
      aside={lists}
    >
      <h3 id="skills-matrix-title" className={styles.matrixTitle}>
        {matrix.title[locale]}
      </h3>
      <p id="skills-matrix-note" className={styles.note}>
        {matrix.note[locale]}
      </p>

      {/* A real table: screen readers announce the technology and the project
          for every cell. */}
      <table
        className={styles.matrix}
        aria-labelledby="skills-matrix-title"
        aria-describedby="skills-matrix-note"
      >
        <thead>
          <tr>
            <th scope="col">{matrix.technology[locale]}</th>
            {projects.map((project) => (
              <th key={project.id} scope="col">
                {project.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <tr key={row.skill}>
              <th scope="row">{row.skill}</th>
              {projects.map((project) => {
                const use = row.cells[project.id];
                return use ? (
                  <td key={project.id} className={styles.used}>
                    {use}
                  </td>
                ) : (
                  <td key={project.id}>
                    <span className="visually-hidden">
                      {matrix.notUsed[locale]}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
