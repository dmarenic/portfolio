import { ImageResponse } from "next/og";

/*
 * Open Graph images: the preview card shown when a link to the site is shared
 * on LinkedIn or elsewhere. They are generated once, at build time, in the
 * site's colours, with a small sequence diagram as the visual.
 */

export const ogSize = { width: 1200, height: 630 };

const colors = {
  background: "#121a27",
  text: "#e3e8f0",
  muted: "#a3afc1",
  line: "#2e3c52",
  request: "#8ea9ff",
  response: "#5ed3b6",
};

/**
 * Downloads Archivo from Google Fonts during the build, limited to the
 * characters in `text`. ImageResponse needs the raw font file, and asking for
 * a single width and weight returns a small static TrueType font.
 */
async function loadArchivo(text: string, weight: number, width: number) {
  const url = `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@${width},${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const source = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!source)
    throw new Error("Could not load Archivo for the Open Graph image.");
  return (await fetch(source[1])).arrayBuffer();
}

type OgImageProps = {
  title: string;
  subtitle: string;
  footer: string;
};

export async function renderOgImage({ title, subtitle, footer }: OgImageProps) {
  const text = `${title}${subtitle}${footer}`;
  const [display, body] = await Promise.all([
    loadArchivo(text, 800, 125),
    loadArchivo(text, 500, 100),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: 72,
        background: colors.background,
        color: colors.text,
        fontFamily: "Archivo",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 690,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Archivo Expanded",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 28, fontSize: 36, color: colors.muted }}>
            {subtitle}
          </div>
        </div>
        <div style={{ fontSize: 28, color: colors.request }}>{footer}</div>
      </div>

      {/* Three lifelines with messages between them, like the hero diagram. */}
      <svg width="300" height="486" viewBox="0 0 300 486">
        {[30, 150, 270].map((x) => (
          <g key={x}>
            <rect
              x={x - 26}
              y="0"
              width="52"
              height="30"
              rx="7"
              fill={colors.line}
            />
            <line
              x1={x}
              y1="30"
              x2={x}
              y2="486"
              stroke={colors.line}
              strokeWidth="3"
            />
          </g>
        ))}
        {[
          { y: 90, from: 30, to: 150, color: colors.request },
          { y: 160, from: 150, to: 30, color: colors.response },
          { y: 230, from: 270, to: 150, color: colors.request },
          { y: 300, from: 150, to: 270, color: colors.response },
          { y: 370, from: 30, to: 150, color: colors.request },
          { y: 440, from: 150, to: 270, color: colors.response },
        ].map(({ y, from, to, color }) => {
          const direction = to > from ? 1 : -1;
          return (
            <g key={y}>
              <line
                x1={from}
                y1={y}
                x2={to - direction * 12}
                y2={y}
                stroke={color}
                strokeWidth="5"
              />
              <path
                d={`M${to} ${y} l${-direction * 16} -9 v18 z`}
                fill={color}
              />
            </g>
          );
        })}
      </svg>
    </div>,
    {
      ...ogSize,
      fonts: [
        {
          name: "Archivo Expanded",
          data: display,
          weight: 800,
          style: "normal",
        },
        { name: "Archivo", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
