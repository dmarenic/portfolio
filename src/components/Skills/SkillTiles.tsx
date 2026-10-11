"use client";

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import styles from "./Skills.module.css";

export type SkillTile = {
  name: string;
  /** Projects that list this skill under "Built with", or "". */
  projects: string;
  icon: ReactNode;
};

type SkillTilesProps = {
  skills: SkillTile[];
};

/*
 * The skills of one card: a small square tile with the icon and the name
 * under it.
 *
 * On hover the tile rises a little and the icon takes the accent colour
 * (CSS). Skills that a project lists under "Built with" also show the
 * projects in a small line under the tiles: on hover, on keyboard focus, or
 * with a tap on touch screens (a second tap or a tap elsewhere closes it).
 * Those skills are buttons, so the keyboard can reach them; screen readers
 * hear the projects as the description of the button.
 */
export function SkillTiles({ skills }: SkillTilesProps) {
  const [active, setActive] = useState<string | null>(null);
  const lastPointer = useRef("mouse");
  const idPrefix = useId();
  const activeSkill = skills.find((skill) => skill.name === active);

  const close = (name: string) =>
    setActive((current) => (current === name ? null : current));

  // A tap with a finger or a pen toggles the projects. A mouse click does
  // nothing extra (hover already shows them), and neither does Enter or
  // Space (event.detail is 0), because keyboard focus already shows them.
  const onClick = (event: MouseEvent<HTMLButtonElement>, name: string) => {
    if (lastPointer.current === "mouse" || event.detail === 0) return;
    setActive((current) => (current === name ? null : name));
  };

  // A tap outside the skills closes the projects.
  useEffect(() => {
    if (active === null) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-skill]")) setActive(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [active]);

  return (
    <>
      <ul className={styles.tiles}>
        {skills.map((skill, i) => {
          const descriptionId = `${idPrefix}-${i}`;
          const content = (
            <>
              <span className={styles.tile}>{skill.icon}</span>
              <span className={styles.skillName}>{skill.name}</span>
            </>
          );
          return (
            <li
              key={skill.name}
              data-active={active === skill.name ? "" : undefined}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" && skill.projects) {
                  setActive(skill.name);
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") close(skill.name);
              }}
            >
              {skill.projects ? (
                <>
                  <button
                    type="button"
                    className={styles.skill}
                    aria-describedby={descriptionId}
                    data-skill
                    onPointerDown={(event) =>
                      (lastPointer.current = event.pointerType)
                    }
                    onClick={(event) => onClick(event, skill.name)}
                    onFocus={(event) => {
                      if (event.target.matches(":focus-visible")) {
                        setActive(skill.name);
                      }
                    }}
                    onBlur={() => close(skill.name)}
                  >
                    {content}
                  </button>
                  <span id={descriptionId} className="visually-hidden">
                    {skill.projects}
                  </span>
                </>
              ) : (
                <div className={styles.skill}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
      {/* One line for the whole card, so a long project name never sticks
          out of the card. Screen readers get it from the buttons above. */}
      <p className={styles.usedIn} aria-hidden="true">
        {activeSkill && `${activeSkill.name}: ${activeSkill.projects}`}
      </p>
    </>
  );
}
