import type { ReactNode } from "react";
import { Code } from "@phosphor-icons/react/dist/ssr/Code";
import { Database } from "@phosphor-icons/react/dist/ssr/Database";
import { skillLogos } from "./skillLogos";

/*
 * The icon of every skill, in one colour (currentColor), so it takes the
 * colour of the text around it instead of the brand colours.
 *
 * A logo is not written into the page: the <use> element points to its
 * symbol in /skill-icons.svg, one file the browser downloads once (see
 * src/app/skill-icons.svg/route.ts).
 *
 * SQL is a language, not a product, so it has no logo: it gets the general
 * database icon from Phosphor (the icons used elsewhere on the site). A skill
 * without a logo gets a general code icon, never someone else's logo.
 */
export function skillIcon(skill: string): ReactNode {
  if (skill === "SQL") return <Database size={24} aria-hidden="true" />;
  const logo = skillLogos[skill];
  if (!logo) return <Code size={24} aria-hidden="true" />;
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/skill-icons.svg#${logo.slug}`} />
    </svg>
  );
}
