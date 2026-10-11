import { projects, skills, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { PeekCarousel } from "@/components/PeekCarousel/PeekCarousel";
import { Section } from "@/components/Section/Section";
import { skillIcon } from "./skillIcons";
import { SkillTiles } from "./SkillTiles";
import styles from "./Skills.module.css";

/*
 * The skills on three cards (frontend, backend and databases, tools and
 * other languages) in a carousel (PeekCarousel), which shows the next card
 * every 6 seconds.
 */
export function Skills({ locale }: { locale: Locale }) {
  const { cards } = skills;
  const of = ui.carousel.of[locale];

  // The projects that list a skill under "Built with", by exact name only,
  // for example "Online Trivia Quiz". Empty when no project lists it.
  const usedIn = (skill: string) =>
    projects
      .filter((project) => project.stack.includes(skill))
      .map((project) => project.name)
      .join(" · ");

  const slides = cards.map((card) => (
    <div key={card.name.en} className={styles.card}>
      <h3 className={styles.cardTitle}>{card.name[locale]}</h3>
      <p className={styles.cardText}>{card.description[locale]}</p>
      <SkillTiles
        skills={card.items.map((name) => ({
          name,
          projects: usedIn(name),
          icon: skillIcon(name),
        }))}
      />
    </div>
  ));

  const skillCount = cards.reduce((sum, card) => sum + card.items.length, 0);

  return (
    <Section
      id="skills"
      title={ui.nav.labels.skills[locale]}
      meta={`(${skillCount})`}
    >
      <div data-reveal>
        <PeekCarousel
          labelledBy="skills-title"
          intervalMs={6000}
          slides={slides}
          slideNames={cards.map((card) => card.name[locale])}
          slideLabels={cards.map((_, i) => `${i + 1} ${of} ${cards.length}`)}
          labels={{
            previous: ui.carousel.previous[locale],
            next: ui.carousel.next[locale],
          }}
        />
      </div>
    </Section>
  );
}
