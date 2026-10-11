import {
  type SimpleIcon,
  siC,
  siCss,
  siDjango,
  siDocker,
  siGit,
  siGithubactions,
  siHtml5,
  siJavascript,
  siKotlin,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siTypescript,
} from "simple-icons";

/*
 * The logo of every skill that has one, from simple-icons. Only the logos
 * imported above are used: they are drawn into one file,
 * /skill-icons.svg (see src/app/skill-icons.svg/route.ts), and the skills
 * point to them from there (see skillIcons.tsx).
 */
export const skillLogos: Record<string, SimpleIcon> = {
  HTML: siHtml5,
  CSS: siCss,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  React: siReact,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  NestJS: siNestjs,
  Python: siPython,
  Django: siDjango,
  PostgreSQL: siPostgresql,
  Prisma: siPrisma,
  Git: siGit,
  C: siC,
  Kotlin: siKotlin,
  Docker: siDocker,
  "GitHub Actions": siGithubactions,
};
