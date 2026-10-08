import { quizRound, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { LiveDiagram } from "./LiveDiagram";

/*
 * Server part of the hero diagram: picks the text for the current language
 * and passes only that to the interactive LiveDiagram. This keeps the rest of
 * the content file out of the JavaScript sent to the browser.
 */
export function SequenceDiagram({ locale }: { locale: Locale }) {
  const text = ui.diagram;

  return (
    <LiveDiagram
      events={quizRound.map((event) => ({
        ...event,
        detail: event.detail[locale],
      }))}
      initialEvent="submit_answer"
      labels={{
        actors: {
          host: text.actors.host[locale],
          server: text.actors.server[locale],
          player: text.actors.player[locale],
        },
        caption: text.caption[locale],
        note: text.note[locale],
        listLabel: text.listLabel[locale],
        sentBy: text.sentBy[locale],
        sentTo: text.sentTo[locale],
        payload: text.payload[locale],
        replay: text.replay[locale],
      }}
    />
  );
}
