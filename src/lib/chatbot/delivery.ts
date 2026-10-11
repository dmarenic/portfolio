import { timingSafeEqual } from "node:crypto";
import { isChatEnabled } from "./config";
import { emailAllNewMessages, emailNewMessages, type Mailer } from "./email";
import { describeError, log } from "./log";
import type { ChatStore } from "./store";
import { endRequestSchema, readJsonBody } from "./validation";
import { isAllowedOrigin } from "./visitor";

/*
 * The two routes that email the conversations to Dominik (see email.ts):
 *
 * POST /api/chat/end    the signal the browser sends (navigator.sendBeacon)
 *                       when the visitor closes the chat or leaves the page.
 *                       It carries only the conversation id.
 * GET  /api/chat/cron   the daily backup job of Vercel, protected with
 *                       CRON_SECRET.
 */

export type DeliveryDeps = {
  store: ChatStore | null;
  // null when Gmail is not set up in production.
  mailer: Mailer | null;
  allowedOrigins: string[];
  development: boolean;
};

export async function handleEnd(
  request: Request,
  deps: DeliveryDeps,
): Promise<Response> {
  // The browser does not wait for an answer, so it is always empty.
  const done = new Response(null, { status: 204 });
  if (!isChatEnabled()) return new Response(null, { status: 404 });

  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin, deps.allowedOrigins, deps.development)) {
    return new Response(null, { status: 403 });
  }

  const body = await readJsonBody(request, 512, [
    "text/plain",
    "application/json",
  ]);
  if (!body.ok) return new Response(null, { status: body.status });
  const parsed = endRequestSchema.safeParse(body.value);
  if (!parsed.success) return new Response(null, { status: 400 });

  const { store, mailer } = deps;
  if (!store || !mailer) {
    log(
      "Emails are not set up (GMAIL_USER, GMAIL_APP_PASSWORD, CHAT_NOTIFY_EMAIL)",
    );
    return done;
  }

  try {
    await emailNewMessages(parsed.data.conversationId, store, mailer);
  } catch (error) {
    // The daily job tries again, because nothing was marked as emailed.
    log(`Emailing a conversation failed: ${describeError(error)}`);
  }
  return done;
}

export async function handleCron(
  request: Request,
  deps: DeliveryDeps,
): Promise<Response> {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" with every run of the
  // job. Anyone else who calls this address gets 401.
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || !sameText(authorization, `Bearer ${secret}`)) {
    return new Response(null, { status: 401 });
  }

  const { store, mailer } = deps;
  if (!store || !mailer) {
    log("The daily job cannot run: Upstash Redis or Gmail is not set up");
    return Response.json({ sent: 0 }, { status: 503 });
  }

  try {
    const sent = await emailAllNewMessages(store, mailer);
    return Response.json({ sent });
  } catch (error) {
    log(`The daily job failed: ${describeError(error)}`);
    return Response.json({ sent: 0 }, { status: 500 });
  }
}

// Compares in constant time, so the response time does not reveal how much
// of a guessed secret was right.
function sameText(a: string, b: string): boolean {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}
