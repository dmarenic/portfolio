import { chatbot } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { answerSettings, isChatEnabled } from "./config";
import type { Generate } from "./gemini";
import type { ChatLimits } from "./limits";
import { describeError, log } from "./log";
import type { ChatStore, Turn } from "./store";
import type { VerifyHuman } from "./turnstile";
import { chatRequestSchema, readJsonBody } from "./validation";
import { clientIp, isAllowedOrigin, visitorId } from "./visitor";

/*
 * What POST /api/chat does, step by step. It lives here instead of in the
 * route file so the tests can call it with a fake store, fake limits and a
 * fake Gemini (route.ts passes the real ones, see deps.ts).
 *
 * 1. Refuses requests from other sites (the Origin header).
 * 2. Checks the request: JSON of at most 4 KB with a valid conversation id
 *    and a message of 1 to 500 characters, and an empty hidden field.
 * 3. Applies the limits on the number of messages.
 * 4. For the first message of a conversation, checks the Turnstile token.
 * 5. Reads the earlier messages of the conversation from the server's own
 *    store. The browser never sends them, so nobody can put words into the
 *    model's mouth.
 * 6. Asks Gemini and streams the answer to the browser as it arrives.
 * 7. Saves the question and the answer.
 *
 * Whenever something fails, the visitor gets a friendly message with
 * Dominik's email (chatbot.errors in site.ts) and the details go only to the
 * server log, without keys or IP addresses.
 */

export type ChatDeps = {
  store: ChatStore | null;
  limits: ChatLimits | null;
  generate: Generate;
  // null when Turnstile is not set up (TURNSTILE_SECRET_KEY).
  verifyHuman: VerifyHuman | null;
  // IP_HASH_SALT; null when it is missing in production.
  salt: string | null;
  allowedOrigins: string[];
  development: boolean;
};

type ErrorReason = keyof typeof chatbot.errors;

export async function handleChat(
  request: Request,
  deps: ChatDeps,
): Promise<Response> {
  if (!isChatEnabled()) return new Response(null, { status: 404 });

  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin, deps.allowedOrigins, deps.development)) {
    log("Refused a request from another origin");
    return failure(403, "invalid", "en");
  }

  const body = await readJsonBody(request);
  if (!body.ok) return failure(body.status, "invalid", "en");

  const parsed = chatRequestSchema.safeParse(body.value);
  if (!parsed.success) {
    return failure(400, "invalid", localeOf(body.value));
  }
  const { conversationId, message, locale, page, website, turnstileToken } =
    parsed.data;

  // The hidden field ("website") is invisible to people, but bots that fill
  // in every field fill it in too.
  if (website) {
    log("Refused a request with the hidden field filled in");
    return failure(400, "invalid", locale);
  }

  const { store, limits, salt } = deps;
  if (!store || !limits || !salt) {
    log(
      "The chat is not set up: Upstash Redis (UPSTASH_REDIS_REST_URL/TOKEN) or IP_HASH_SALT is missing",
    );
    return failure(503, "unavailable", locale);
  }

  try {
    const visitor = visitorId(clientIp(request), salt);
    if (!(await limits.perTenMinutes.limit(visitor)).success) {
      return failure(429, "tooFast", locale);
    }
    if (!(await limits.perDay.limit(visitor)).success) {
      return failure(429, "daily", locale);
    }

    const existing = await store.get(conversationId);
    // Every stored exchange is one message of the visitor.
    const asked = (existing?.turns.length ?? 0) / 2;
    if (asked >= limits.perConversation) {
      return failure(429, "conversation", locale);
    }

    // Turnstile is checked once per conversation, before it is stored, so
    // every stored conversation has passed it.
    if (!existing && deps.verifyHuman) {
      if (!(await deps.verifyHuman(turnstileToken))) {
        return failure(403, "verification", locale);
      }
    }

    // Last, so refused requests do not use up the site's daily messages.
    if (!(await limits.sitePerDay.limit("site")).success) {
      log("The daily limit of the whole site was reached");
      return failure(429, "site", locale);
    }

    if (!existing) {
      await store.start(conversationId, {
        startedAt: new Date().toISOString(),
        locale,
        page,
      });
    }

    const question: Turn = {
      role: "user",
      text: message,
      at: new Date().toISOString(),
    };
    return await answer({
      store,
      generate: deps.generate,
      conversationId,
      question,
      history: recentHistory(existing?.turns ?? []),
      locale,
      requestSignal: request.signal,
    });
  } catch (error) {
    log(`Chat request failed: ${describeError(error)}`);
    return failure(503, "unavailable", locale);
  }
}

/** Asks the model and streams its answer, then saves the exchange. */
async function answer({
  store,
  generate,
  conversationId,
  question,
  history,
  locale,
  requestSignal,
}: {
  store: ChatStore;
  generate: Generate;
  conversationId: string;
  question: Turn;
  history: Turn[];
  locale: Locale;
  requestSignal: AbortSignal;
}): Promise<Response> {
  // Stops Gemini when the answer takes longer than 20 seconds or the visitor
  // goes away (closes the tab, or the stream is cancelled).
  const cancelled = new AbortController();
  const signal = AbortSignal.any([
    requestSignal,
    cancelled.signal,
    AbortSignal.timeout(answerSettings.timeoutMs),
  ]);
  const pieces = generate({ history, message: question.text, signal })[
    Symbol.asyncIterator
  ]();

  const save = async (text: string, failed: boolean) => {
    const reply: Turn = { role: "model", text, at: new Date().toISOString() };
    if (failed) reply.failed = true;
    try {
      await store.addExchange(conversationId, question, reply);
    } catch (error) {
      log(`Saving the conversation failed: ${describeError(error)}`);
    }
  };

  // Waits for the first piece before answering, so an error at the start
  // (a wrong key, an exhausted quota, Gemini being down) becomes a proper
  // error response that the window shows as a notice.
  let first: IteratorResult<string>;
  try {
    first = await pieces.next();
    if (first.done) throw new Error("Gemini returned an empty answer");
  } catch (error) {
    log(`Gemini failed: ${describeError(error)}`);
    const notice = chatbot.errors.unavailable[locale];
    await save(notice, true);
    return failure(503, "unavailable", locale);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // enqueue throws once the visitor has gone away; that is not an error.
      const send = (text: string) => {
        try {
          controller.enqueue(encoder.encode(text));
        } catch {}
      };

      let text = first.value;
      let failed = false;
      send(text);
      try {
        for (;;) {
          const next = await pieces.next();
          if (next.done) break;
          text += next.value;
          send(next.value);
        }
      } catch (error) {
        // The answer broke off halfway (for example after 20 seconds).
        log(`Gemini stopped mid-answer: ${describeError(error)}`);
        failed = true;
        const notice = `\n\n${chatbot.errors.unavailable[locale]}`;
        text += notice;
        send(notice);
      }

      await save(text, failed);
      try {
        controller.close();
      } catch {}
    },
    cancel() {
      cancelled.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * The last 10 exchanges (a question and its answer) for the model. Exchanges
 * where the model did not answer are left out, because the model never said
 * those notices.
 */
export function recentHistory(turns: Turn[]): Turn[] {
  const exchanges: Turn[][] = [];
  for (let i = 0; i + 1 < turns.length; i += 2) {
    const [question, reply] = [turns[i], turns[i + 1]];
    if (question.role === "user" && reply.role === "model" && !reply.failed) {
      exchanges.push([question, reply]);
    }
  }
  return exchanges.slice(-answerSettings.historyExchanges).flat();
}

/** A friendly message for the visitor, as JSON with an error status. */
export function failure(
  status: number,
  reason: ErrorReason,
  locale: Locale,
): Response {
  return Response.json(
    { error: reason, message: chatbot.errors[reason][locale] },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

// The language for an error message when the request itself was invalid.
function localeOf(value: unknown): Locale {
  const locale = (value as { locale?: unknown } | null)?.locale;
  return locale === "hr" ? "hr" : "en";
}
