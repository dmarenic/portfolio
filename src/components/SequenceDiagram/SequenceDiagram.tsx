import type { CSSProperties } from "react";
import { ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import styles from "./SequenceDiagram.module.css";

/*
 * A sequence diagram of one round of the Online Trivia Quiz, drawn as SVG.
 * The events are the real Socket.IO events from the quiz backend
 * (see SOCKET_PROTOCOL.md in the online-trivia-quiz repository).
 *
 * The SVG is generated from the `messages` list: each message becomes one row
 * with an arrow between two lifelines. Narrow screens get a shorter list and
 * larger text, so the diagram stays readable on a phone.
 */

type Actor = "host" | "server" | "player";

type Message = {
  event: string;
  from: Actor;
  to: Actor[];
};

const fullRound: Message[] = [
  { event: "create_room", from: "host", to: ["server"] },
  { event: "room_created", from: "server", to: ["host"] },
  { event: "join_room", from: "player", to: ["server"] },
  { event: "player_joined", from: "server", to: ["host", "player"] },
  { event: "start_game", from: "host", to: ["server"] },
  { event: "game_started", from: "server", to: ["host", "player"] },
  { event: "submit_answer", from: "player", to: ["server"] },
  { event: "answer_result", from: "server", to: ["player"] },
  { event: "question_ended", from: "server", to: ["host", "player"] },
];

const shortRoundEvents = [
  "create_room",
  "join_room",
  "start_game",
  "submit_answer",
  "answer_result",
  "question_ended",
];
const shortRound = fullRound.filter((m) => shortRoundEvents.includes(m.event));

type Layout = {
  width: number;
  lifelineX: Record<Actor, number>;
  actorWidth: number;
  firstRowY: number;
  rowHeight: number;
};

const wide: Layout = {
  width: 520,
  lifelineX: { host: 70, server: 260, player: 450 },
  actorWidth: 104,
  firstRowY: 84,
  rowHeight: 38,
};

const narrow: Layout = {
  width: 344,
  lifelineX: { host: 44, server: 162, player: 300 },
  actorWidth: 88,
  firstRowY: 84,
  rowHeight: 46,
};

const actors: Actor[] = ["host", "server", "player"];

type DiagramProps = {
  messages: Message[];
  layout: Layout;
  locale: Locale;
  className: string;
};

function Diagram({ messages, layout, locale, className }: DiagramProps) {
  const { width, lifelineX, actorWidth, firstRowY, rowHeight } = layout;
  const noteY = firstRowY + messages.length * rowHeight + 2;
  const height = noteY + 22;

  return (
    <svg
      className={`${styles.svg} ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
    >
      {actors.map((actor) => (
        <g key={actor}>
          <rect
            className={styles.actorBox}
            x={lifelineX[actor] - actorWidth / 2}
            y={8}
            width={actorWidth}
            height={34}
            rx={8}
          />
          <text
            className={styles.actorName}
            x={lifelineX[actor]}
            y={30}
            textAnchor="middle"
          >
            {ui.diagram.actors[actor][locale]}
          </text>
          <line
            className={styles.lifeline}
            x1={lifelineX[actor]}
            y1={42}
            x2={lifelineX[actor]}
            y2={noteY - 18}
          />
        </g>
      ))}

      {messages.map((message, index) => {
        const y = firstRowY + index * rowHeight;
        const fromX = lifelineX[message.from];
        const toServer = message.to[0] === "server";
        const goesLeft =
          message.to.length === 1 && lifelineX[message.to[0]] < fromX;
        const toEveryone = message.to.length > 1;

        // Arrows start and end 3px away from the lifelines.
        const arrows = message.to.map((target) => {
          const toX = lifelineX[target];
          const direction = toX > fromX ? 1 : -1;
          return {
            x1: fromX + direction * 3,
            x2: toX - direction * 3,
            direction,
          };
        });

        const labelX = goesLeft ? fromX - 10 : fromX + 10;

        return (
          <g
            key={message.event}
            className={`${styles.message} ${toServer ? styles.request : styles.response} ${
              toEveryone
                ? styles.fromCenter
                : goesLeft
                  ? styles.toLeft
                  : styles.toRight
            }`}
            style={{ "--i": index } as CSSProperties}
          >
            <text
              className={styles.event}
              x={labelX}
              y={y - 8}
              textAnchor={goesLeft ? "end" : "start"}
            >
              {message.event}
            </text>
            {arrows.map((arrow) => (
              <g key={arrow.x2}>
                <line
                  className={styles.arrow}
                  x1={arrow.x1}
                  y1={y}
                  x2={arrow.x2}
                  y2={y}
                />
                {/* Arrowhead: a small triangle pointing in the arrow's direction. */}
                <path
                  className={styles.head}
                  d={`M${arrow.x2} ${y} l${-arrow.direction * 9} -4.5 v9 z`}
                />
              </g>
            ))}
          </g>
        );
      })}

      <text
        className={styles.note}
        x={lifelineX.server}
        y={noteY}
        textAnchor="middle"
      >
        {ui.diagram.note[locale]}
      </text>
    </svg>
  );
}

export function SequenceDiagram({ locale }: { locale: Locale }) {
  return (
    <figure className={styles.figure}>
      <Diagram
        messages={fullRound}
        layout={wide}
        locale={locale}
        className={styles.wide}
      />
      <Diagram
        messages={shortRound}
        layout={narrow}
        locale={locale}
        className={styles.narrow}
      />
      {/* The drawing is hidden from screen readers; this text describes it instead. */}
      <p className="visually-hidden">{ui.diagram.description[locale]}</p>
      <figcaption className={styles.caption}>
        {ui.diagram.caption[locale]}
      </figcaption>
    </figure>
  );
}
