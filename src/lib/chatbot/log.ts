import { ApiError } from "@google/genai";

/*
 * The server log of the chat (Vercel shows it under Logs). It must never
 * contain keys, passwords or IP addresses, so errors are reduced to a short
 * description, and the values of the secret settings are blanked out in case
 * an error message ever repeats one.
 */

const SECRETS = [
  "GEMINI_API_KEY",
  "GMAIL_APP_PASSWORD",
  "UPSTASH_REDIS_REST_TOKEN",
  "KV_REST_API_TOKEN",
  "TURNSTILE_SECRET_KEY",
  "CRON_SECRET",
  "IP_HASH_SALT",
];

export function log(message: string): void {
  let text = message;
  for (const name of SECRETS) {
    const value = process.env[name];
    if (value) text = text.replaceAll(value, `[${name}]`);
  }
  console.error(`[chat] ${text}`);
}

/**
 * A short description of an error: the name, the HTTP status from Gemini
 * (429 means the quota is used up) and the first part of the message.
 */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    return `ApiError ${error.status}: ${error.message.slice(0, 200)}`;
  }
  if (error instanceof Error) {
    return `${error.name}: ${error.message.slice(0, 200)}`;
  }
  return "Unknown error";
}
