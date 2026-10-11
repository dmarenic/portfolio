import { Fragment, type ReactNode } from "react";

/*
 * Shows an answer of the model as text, never as HTML.
 *
 * The model is asked to write plain text, but it may still use a little
 * Markdown. Only three things are recognised, and each one becomes an
 * ordinary React element, so nothing in the answer can turn into HTML or a
 * script:
 *
 * - lines starting with "- " or "* " become a list,
 * - **text** becomes bold,
 * - https:// addresses and email addresses become links.
 *
 * Everything else is shown exactly as written, with its line breaks.
 */
export function FormattedAnswer({
  text,
  newTabLabel,
}: {
  text: string;
  // "(opens in a new tab)" for screen readers, as in ExternalLink.
  newTabLabel: string;
}) {
  const inline = (line: string) => inlineParts(line, newTabLabel);
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const lines = paragraph;
    blocks.push(
      <p key={blocks.length}>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && <br />}
            {inline(line)}
          </Fragment>
        ))}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={blocks.length}>
        {list.map((item, index) => (
          <li key={index}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const line of text.split("\n")) {
    const item = line.match(/^\s*[-*•]\s+(.*)$/);
    if (item) {
      flushParagraph();
      list.push(item[1]);
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <>{blocks}</>;
}

// **bold**, https://... and name@example.com inside one line.
const INLINE =
  /(\*\*[^*\n]+\*\*|https:\/\/[^\s<>()"]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function inlineParts(line: string, newTabLabel: string): ReactNode[] {
  // split() with a group in the pattern returns the plain text and the
  // matches in turn: even positions are plain text, odd positions matches.
  return line.split(INLINE).map((part, index) => {
    if (index % 2 === 0) return part;
    if (part.startsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("https://")) {
      // A full stop or comma right after an address belongs to the sentence.
      const url = part.replace(/[.,;:!?]+$/, "");
      return (
        <Fragment key={index}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
            <span className="visually-hidden"> {newTabLabel}</span>
          </a>
          {part.slice(url.length)}
        </Fragment>
      );
    }
    // The only match left is an email address.
    return (
      <a key={index} href={`mailto:${part}`}>
        {part}
      </a>
    );
  });
}

/** The answer without the Markdown marks, for screen readers (aria-live). */
export function plainText(text: string): string {
  return text.replace(/^\s*[-*•]\s+/gm, "").replaceAll("**", "");
}
