"use client";

import { type CSSProperties, useId, useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr/ArrowCounterClockwise";
import type { DiagramActor } from "@/content/site";
import styles from "./SequenceDiagram.module.css";

/*
 * An interactive sequence diagram of one round of the quiz.
 *
 * Three lifelines (host, server, player) run down the diagram. Every event is
 * a row with an arrow between two lifelines; on load the arrows are drawn one
 * after another and a "packet" travels along each of them, like the real
 * messages would. Every row is a button: selecting it shows what the event
 * carries in the panel below. "Replay" restarts the animation by giving the
 * list a new React key, which mounts it again.
 */

type DiagramEvent = {
  event: string;
  from: DiagramActor;
  to: DiagramActor[];
  payload: string;
  detail: string;
};

type LiveDiagramProps = {
  events: DiagramEvent[];
  initialEvent: string;
  labels: {
    actors: Record<DiagramActor, string>;
    caption: string;
    note: string;
    listLabel: string;
    sentBy: string;
    sentTo: string;
    payload: string;
    replay: string;
  };
};

const actors: DiagramActor[] = ["host", "server", "player"];

// Index of each lifeline's column: host 0, server 1, player 2.
const column: Record<DiagramActor, number> = { host: 0, server: 1, player: 2 };

type ArrowProps = {
  from: DiagramActor;
  to: DiagramActor;
  label?: string;
};

function Arrow({ from, to, label }: ArrowProps) {
  const start = Math.min(column[from], column[to]);
  const span = Math.abs(column[from] - column[to]);
  const direction = column[to] > column[from] ? styles.toRight : styles.toLeft;

  return (
    <span
      className={`${styles.arrow} ${direction}`}
      style={{ "--start": start, "--span": span } as CSSProperties}
      aria-hidden="true"
    >
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.line} />
      <span className={styles.packet} />
    </span>
  );
}

export function LiveDiagram({
  events,
  initialEvent,
  labels,
}: LiveDiagramProps) {
  const [selected, setSelected] = useState(initialEvent);
  const [round, setRound] = useState(0);
  const detailsId = useId();

  const current = events.find((e) => e.event === selected) ?? events[0];
  const names = (list: DiagramActor[]) =>
    list.map((a) => labels.actors[a]).join(", ");

  return (
    <figure className={styles.figure}>
      <div className={styles.diagram}>
        <div className={styles.actors} aria-hidden="true">
          {actors.map((actor) => (
            <span key={actor} className={styles.actor}>
              {labels.actors[actor]}
            </span>
          ))}
        </div>

        <div className={styles.lifelines} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <ol key={round} className={styles.rows} aria-label={labels.listLabel}>
          {events.map((e, index) => {
            const isRequest = e.to[0] === "server";
            // A message to everyone is drawn as two arrows going out from the
            // server; the label sits on the arrow that points right.
            const labelTarget =
              e.to.find((t) => column[t] > column[e.from]) ?? e.to[0];

            return (
              <li
                key={e.event}
                className={isRequest ? styles.request : styles.response}
                style={{ "--i": index } as CSSProperties}
              >
                <button
                  type="button"
                  className={styles.row}
                  aria-pressed={e.event === selected}
                  aria-controls={detailsId}
                  onClick={() => setSelected(e.event)}
                >
                  <span className="visually-hidden">
                    {e.event}. {labels.sentBy}: {labels.actors[e.from]}.{" "}
                    {labels.sentTo}: {names(e.to)}.
                  </span>
                  {e.to.map((target) => (
                    <Arrow
                      key={target}
                      from={e.from}
                      to={target}
                      label={target === labelTarget ? e.event : undefined}
                    />
                  ))}
                </button>
              </li>
            );
          })}
        </ol>

        <p className={styles.note}>{labels.note}</p>
      </div>

      <div id={detailsId} className={styles.details} aria-live="polite">
        <p className={styles.detailsTitle}>
          <code>{current.event}</code>
        </p>
        <dl className={styles.facts}>
          <div>
            <dt>{labels.sentBy}</dt>
            <dd>{labels.actors[current.from]}</dd>
          </div>
          <div>
            <dt>{labels.sentTo}</dt>
            <dd>{names(current.to)}</dd>
          </div>
          <div className={styles.payload}>
            <dt>{labels.payload}</dt>
            <dd>
              <code>{current.payload}</code>
            </dd>
          </div>
        </dl>
        <p className={styles.detailText}>{current.detail}</p>
      </div>

      <figcaption className={styles.footer}>
        <p className={styles.caption}>{labels.caption}</p>
        <button
          type="button"
          className={styles.replay}
          onClick={() => setRound((r) => r + 1)}
        >
          <ArrowCounterClockwise size={16} weight="bold" aria-hidden="true" />
          {labels.replay}
        </button>
      </figcaption>
    </figure>
  );
}
