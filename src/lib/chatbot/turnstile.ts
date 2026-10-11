/*
 * Cloudflare Turnstile: a check, usually invisible, that the visitor is a
 * person and not a bot. The widget in the chat window gives the browser a
 * token; the server asks Cloudflare whether the token is valid, once, with
 * the first message of each conversation.
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Says whether a Turnstile token is valid. */
export type VerifyHuman = (token: string | undefined) => Promise<boolean>;

/** The check, or null when TURNSTILE_SECRET_KEY is not set. */
export function turnstileFromEnv(): VerifyHuman | null {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  return secret ? (token) => verifyToken(token, secret) : null;
}

async function verifyToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // Cloudflare could not be reached; the visitor is asked to try again.
    return false;
  }
}
