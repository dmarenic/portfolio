import { ImageResponse } from "next/og";

/*
 * Open Graph images: the preview card shown when a link to the site is shared
 * on LinkedIn or elsewhere. They are generated once, at build time, and look
 * like the top of the home page: the light page colour, a name set large with
 * the first part as an outline and the rest solid, and the lime accent.
 */

export const ogSize = { width: 1200, height: 630 };

// The colours of the light theme (see globals.css).
const colors = {
  paper: "#ececea",
  surface: "#f7f7f5",
  ink: "#161816",
  muted: "#5a5d59",
  line: "#d3d4d0",
  accent: "#c8e05a",
  status: "#2fa36b",
};

/**
 * Downloads Geist, the font of the site, from Google Fonts during the build,
 * limited to the characters in `text`. ImageResponse needs the raw font file,
 * and asking for a single weight returns a small static TrueType font.
 */
async function loadGeist(text: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const source = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!source)
    throw new Error("Could not load Geist for the Open Graph image.");
  return (await fetch(source[1])).arrayBuffer();
}

type OgImageProps = {
  // The large lines, for example "DOMINIK" as an outline and "MARENIĆ" solid.
  // Pass them in capitals: the font is downloaded with only these letters.
  lines: { text: string; outline?: boolean }[];
  // Size of the large lines, chosen so the longest one fits the width.
  fontSize: number;
  subtitle: string;
  // The "looking for work" line with the green dot, as in the top bar.
  status?: string;
  footer: string;
};

export async function renderOgImage({
  lines,
  fontSize,
  subtitle,
  status = "",
  footer,
}: OgImageProps) {
  const [display, body] = await Promise.all([
    loadGeist(lines.map((line) => line.text).join(""), 700),
    loadGeist(`${subtitle}${status}${footer}`, 500),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: colors.paper,
        color: colors.ink,
        fontFamily: "Geist",
        fontWeight: 500,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {status ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 26px",
              border: `1px solid ${colors.line}`,
              borderRadius: 999,
              background: colors.surface,
              fontSize: 24,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: colors.status,
              }}
            />
            {status}
          </div>
        ) : (
          <div />
        )}
        {/* The DM monogram, the same drawing as the favicon (app/icon.svg). */}
        <svg width="64" height="64" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="7" fill={colors.ink} />
          <path
            d="M5 9h4.5a7 7 0 0 1 0 14H5z"
            fill="none"
            stroke={colors.paper}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M18.5 23V9h2.9l1.9 6.4 1.9-6.4H28v14h-2.4v-8.8l-1.4 4.8h-1.9l-1.4-4.8V23z"
            fill={colors.paper}
          />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {lines.map((line) => (
          <div
            key={line.text}
            style={{
              fontWeight: 700,
              fontSize,
              // A little looser than in the hero, so the accent on Ć stays
              // clear of the line above it.
              lineHeight: 1,
              letterSpacing: -0.045 * fontSize,
              // The outline: the image generator draws no stroke around
              // transparent text, so the letters are filled with the page
              // colour instead. The fill covers the inner half of the
              // stroke, so the stroke is set twice as wide as it should look.
              ...(line.outline
                ? {
                    color: colors.paper,
                    WebkitTextStroke: `${2 * Math.max(1.5, fontSize * 0.012)}px ${colors.ink}`,
                  }
                : {}),
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: -0.6 }}>{subtitle}</div>
        <div
          style={{
            padding: "12px 26px",
            borderRadius: 999,
            background: colors.accent,
            fontSize: 24,
          }}
        >
          {footer}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: display, weight: 700, style: "normal" },
        { name: "Geist", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
