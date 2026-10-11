import { z } from "zod";
import { locales } from "@/lib/i18n";

/*
 * Checks of what the browser sends to /api/chat. Everything from the browser
 * is untrusted, so a request is used only after it passed all of these.
 */

export const MAX_MESSAGE_LENGTH = 500;
export const MAX_BODY_BYTES = 4 * 1024;

// Control characters (invisible characters such as NUL, tab or escape),
// except the line break (\n), which Shift+Enter puts into a message.
const CONTROL_CHARACTERS = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/;

export const chatRequestSchema = z.strictObject({
  // A random UUID made by the browser (crypto.randomUUID()).
  conversationId: z.uuid(),
  message: z
    .string()
    .trim()
    .min(1)
    .max(MAX_MESSAGE_LENGTH)
    .refine((text) => !CONTROL_CHARACTERS.test(text)),
  locale: z.enum(locales),
  // The page the visitor wrote from, for the email (for example /hr).
  page: z
    .string()
    .max(100)
    .regex(/^\/[a-z0-9/-]*$/i),
  // The hidden field for bots; people leave it empty (see handler.ts).
  website: z.string().max(200).optional(),
  // Cloudflare Turnstile token, sent with the first message.
  turnstileToken: z.string().max(2048).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** Why a request was rejected, with the HTTP status to answer with. */
export type BodyProblem = { status: 400 | 413 | 415 };

/**
 * Reads a JSON body of at most `maxBytes` bytes. It stops reading as soon as
 * the limit is passed, so a huge body is never loaded into memory.
 */
export async function readJsonBody(
  request: Request,
  maxBytes = MAX_BODY_BYTES,
  // navigator.sendBeacon can only send text/plain, so /api/chat/end accepts
  // JSON written as plain text too.
  types = ["application/json"],
): Promise<{ ok: true; value: unknown } | ({ ok: false } & BodyProblem)> {
  const type = (request.headers.get("content-type") ?? "").toLowerCase();
  if (!types.some((allowed) => type.startsWith(allowed))) {
    return { ok: false, status: 415 };
  }

  const declared = Number(request.headers.get("content-length"));
  if (declared > maxBytes) return { ok: false, status: 413 };
  if (!request.body) return { ok: false, status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return { ok: false, status: 413 };
    }
    chunks.push(value);
  }

  try {
    const text = new TextDecoder().decode(Buffer.concat(chunks));
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400 };
  }
}

/** What the browser sends to /api/chat/end: only the conversation id. */
export const endRequestSchema = z.strictObject({ conversationId: z.uuid() });
