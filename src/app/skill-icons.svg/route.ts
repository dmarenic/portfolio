import { skillLogos } from "@/components/Skills/skillLogos";

/*
 * /skill-icons.svg: one SVG file with the logo of every skill as a <symbol>
 * (id = the simple-icons slug, for example "react"). The skills show a logo
 * with <use href="/skill-icons.svg#react">, so the browser downloads the
 * logos once and keeps them in its cache, instead of every page carrying
 * them in its HTML twice (once in the HTML and once in the data React needs
 * for the carousel).
 *
 * The paths have no colour of their own: they take the colour of the text
 * around the icon (fill="currentColor" on the <svg> that uses them).
 *
 * force-static: the file is made once at build time, like the pages.
 */
export const dynamic = "force-static";

export function GET() {
  const symbols = Object.values(skillLogos)
    .map(
      (logo) =>
        `<symbol id="${logo.slug}" viewBox="0 0 24 24"><path d="${logo.path}"/></symbol>`,
    )
    .join("");

  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`,
    { headers: { "Content-Type": "image/svg+xml" } },
  );
}
