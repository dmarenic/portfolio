import { Fragment, type ReactNode } from "react";

/**
 * Turns text with parts between backticks into React nodes, with those parts
 * in <code>: "sends `timer_updated` every second" -> sends <code>timer_updated
 * </code> every second. Splitting on the backtick gives the plain text at
 * even positions and the code at odd positions.
 */
export function withCode(text: string): ReactNode {
  return text
    .split("`")
    .map((part, index) =>
      index % 2 === 1 ? (
        <code key={index}>{part}</code>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}
