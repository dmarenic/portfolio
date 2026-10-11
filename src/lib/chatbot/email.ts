import nodemailer from "nodemailer";
import { chatbot, siteUrl } from "@/content/site";
import type { ChatStore, ConversationMeta, Turn } from "./store";

/*
 * Conversations are emailed to Dominik (CHAT_NOTIFY_EMAIL) through Gmail:
 * once when the visitor closes the chat or leaves the page (the browser
 * sends a signal to /api/chat/end), and once a day as a backup for the ones
 * that got no signal (/api/chat/cron). The text always comes from the
 * server's own store, never from the browser.
 *
 * Each message is emailed only once: the store remembers how many have been
 * sent, so a visitor who comes back and continues produces an email with
 * only the new messages.
 */

export type Email = { subject: string; text: string; html: string };

export type Mailer = { send(email: Email): Promise<void> };

/**
 * Gmail with an app password (GMAIL_USER, GMAIL_APP_PASSWORD), sending to
 * CHAT_NOTIFY_EMAIL. null when any of them is missing.
 */
export function gmailFromEnv(): Mailer | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CHAT_NOTIFY_EMAIL;
  if (!user || !pass || !to) return null;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return {
    async send(email) {
      await transporter.sendMail({
        from: `${chatbot.name} <${user}>`,
        to,
        ...email,
      });
    },
  };
}

/**
 * During local development without Gmail settings the email is written to
 * the terminal of npm run dev instead, so the whole flow can be tried.
 */
export const terminalMailer: Mailer = {
  async send(email) {
    console.info(`[chat] Email "${email.subject}"\n${email.text}`);
  },
};

export type EmailResult = "sent" | "nothing new" | "busy" | "expired";

/** Emails the messages of a conversation that have not been emailed yet. */
export async function emailNewMessages(
  id: string,
  store: ChatStore,
  mailer: Mailer,
): Promise<EmailResult> {
  if (!(await store.lock(id))) return "busy";
  try {
    const conversation = await store.get(id);
    if (!conversation) return "expired";

    const { meta, turns, emailedTurns } = conversation;
    if (turns.length <= emailedTurns) return "nothing new";

    await mailer.send(
      composeEmail(meta, turns.slice(emailedTurns), emailedTurns > 0),
    );
    await store.markEmailed(id, turns.length);
    return "sent";
  } finally {
    await store.unlock(id);
  }
}

/**
 * Goes through the conversations of the last 48 hours and emails what has
 * not been emailed yet. Used by the daily job.
 */
export async function emailAllNewMessages(
  store: ChatStore,
  mailer: Mailer,
): Promise<number> {
  let sent = 0;
  for (const id of await store.recent()) {
    const result = await emailNewMessages(id, store, mailer);
    if (result === "sent") sent += 1;
    if (result === "expired") await store.forget(id);
  }
  return sent;
}

const SUBJECT = `Novi razgovor s ${chatbot.name}`;
const LANGUAGES = { en: "engleski", hr: "hrvatski" };

/**
 * The email in Croatian: when, in which language, from which page, and the
 * messages. Everything the visitor or the model wrote is escaped before it
 * goes into the HTML, so it is shown as text and can never become a link,
 * an image or a script in the email.
 */
export function composeEmail(
  meta: ConversationMeta,
  turns: Turn[],
  continued: boolean,
): Email {
  const page = new URL(meta.page, siteUrl).toString();
  const facts: [string, string][] = [
    ["Početak razgovora", formatTime(meta.startedAt)],
    ["Zadnja poruka", formatTime(turns.at(-1)?.at ?? meta.startedAt)],
    ["Jezik", LANGUAGES[meta.locale]],
    ["Stranica", page],
  ];
  const intro = continued
    ? "Posjetitelj se vratio i nastavio razgovor. Ovo su nove poruke."
    : "Posjetitelj je razgovarao s asistentom na stranici.";

  const speaker = (turn: Turn) =>
    turn.role === "user" ? "Posjetitelj" : chatbot.name;
  const note = (turn: Turn) =>
    turn.failed ? " (model nije odgovorio, poslana je poruka stranice)" : "";

  const text = [
    intro,
    "",
    ...facts.map(([label, value]) => `${label}: ${value}`),
    "",
    ...turns.map(
      (turn) =>
        `${speaker(turn)}, ${formatTime(turn.at)}${note(turn)}:\n${turn.text}\n`,
    ),
  ].join("\n");

  const html = `<!doctype html>
<html lang="hr">
<body style="margin:0;padding:24px;background:#ececea;font-family:Arial,sans-serif;color:#161816">
<div style="max-width:640px;margin:0 auto">
<p style="margin:0 0 16px">${escapeHtml(intro)}</p>
<table style="border-collapse:collapse;margin:0 0 24px;font-size:14px">
${facts
  .map(
    ([label, value]) =>
      `<tr><td style="padding:2px 16px 2px 0;color:#5a5d59">${escapeHtml(label)}</td><td style="padding:2px 0">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table>
${turns
  .map((turn) => {
    const visitor = turn.role === "user";
    return `<div style="margin:0 0 12px;padding:12px 16px;border-radius:12px;border:1px solid #d3d4d0;background:${visitor ? "#c8e05a" : "#f7f7f5"}">
<div style="margin:0 0 6px;font-size:12px;color:#3a3d39"><strong>${escapeHtml(speaker(turn))}</strong>, ${escapeHtml(formatTime(turn.at))}${escapeHtml(note(turn))}</div>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.5">${escapeHtml(turn.text)}</div>
</div>`;
  })
  .join("\n")}
</div>
</body>
</html>`;

  return { subject: SUBJECT, text, html };
}

/** Replaces the characters that mean something in HTML with entities. */
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// 11. 10. 2026. 14:05, Croatian time.
function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Zagreb",
  }).format(date);
}
