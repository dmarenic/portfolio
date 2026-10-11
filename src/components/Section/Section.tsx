import type { CSSProperties, ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  title: string;
  /** A short fact right of the heading, taken from the content (for
   *  example the number of projects). */
  meta?: string;
  /** Background of the panel; neighbouring panels use different tones. */
  tone?: "light" | "dark";
  /** Rounded bottom corners: the next section lies underneath this one. */
  roundBottom?: boolean;
  /** Lies underneath the previous panel and is uncovered as it leaves. */
  underneath?: boolean;
  /** A large visible line under the heading instead of the faint word
   *  above it (the contact section uses it as its call to action). */
  display?: ReactNode;
  children: ReactNode;
};

/**
 * A page section drawn as a panel (see .panel in globals.css). The id is the
 * anchor used by the navigation (/#projects). data-section repeats it, so the
 * floating navigation can tell which section is on screen (see Dock.tsx).
 *
 * A panel that lies underneath (contact) is pinned to the bottom of the
 * screen while the panel above it is still on screen. A browser scrolls to
 * where an element is at the moment of the click, which for a pinned panel
 * is behind the panel above it, so a link to it ended up on About. So for
 * that panel the id goes to an empty marker right in front of it, which
 * stays in the normal flow and never moves.
 *
 * Every section starts with its title set very large and faint above the
 * real heading, like a watermark, which drifts sideways while the section
 * crosses the screen (data-drift). That large word is decoration only, so
 * screen readers skip it (aria-hidden); they read the h2. The slash before
 * the h2 is hidden from them too, so they read "Projects", not "slash
 * Projects".
 */
export function Section({
  id,
  title,
  meta,
  tone = "light",
  roundBottom = false,
  underneath = false,
  display,
  children,
}: SectionProps) {
  const headingId = `${id}-title`;
  const classes = [
    "panel",
    tone === "dark" && "tone-dark",
    roundBottom && "panel-round-bottom",
    underneath && "panel-underneath",
  ]
    .filter(Boolean)
    .join(" ");

  const titleRow = (
    <div className={styles.titleRow} data-reveal>
      <h2 id={headingId} className={styles.title}>
        <span className={styles.slash} aria-hidden="true">
          /
        </span>
        {title}
      </h2>
      {meta && <p className={styles.meta}>{meta}</p>}
    </div>
  );

  return (
    <>
      {underneath && <div id={id} className={styles.anchor} />}
      <section
        id={underneath ? undefined : id}
        data-section={id}
        className={classes}
        aria-labelledby={headingId}
      >
        <div className="container">
          {display ? (
            <div className={styles.headDisplay}>
              {titleRow}
              <p className={styles.display} data-reveal>
                {display}
              </p>
            </div>
          ) : (
            <div className={styles.head}>
              {/* --letters lets the CSS size the word to fill the width. */}
              <span
                className={styles.word}
                style={{ "--letters": title.length } as CSSProperties}
                aria-hidden="true"
                data-drift
              >
                {title}
              </span>
              {titleRow}
            </div>
          )}
          {children}
        </div>
      </section>
    </>
  );
}
