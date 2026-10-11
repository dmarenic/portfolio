/**
 * Settings of the chatbot that come from environment variables. Server only:
 * none of these variables has the NEXT_PUBLIC_ prefix, so Next.js never puts
 * them into the JavaScript sent to the browser. .env.example lists them all.
 */

/** CHAT_ENABLED=false turns the chatbot off. Anything else leaves it on. */
export function isChatEnabled(): boolean {
  return process.env.CHAT_ENABLED !== "false";
}

/** The Gemini model. gemini-3.1-flash-lite is a stable model (checked in
 *  the Gemini API documentation in October 2026). */
export function geminiModel(): string {
  return process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
}

/** Settings of every answer. */
export const answerSettings = {
  // About 300 words at most, enough for the 2 to 5 sentences the model is
  // asked for.
  maxOutputTokens: 400,
  // Low: the model should stick to the facts rather than be creative.
  temperature: 0.4,
  // The whole answer must arrive within 20 seconds.
  timeoutMs: 20_000,
  // How many earlier exchanges (a question and its answer) the model sees.
  historyExchanges: 10,
};

/** Conversations are kept for 48 hours after the last message. */
export const conversationTtlSeconds = 48 * 60 * 60;
