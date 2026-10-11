import type { DeliveryDeps } from "./delivery";
import { gmailFromEnv, terminalMailer } from "./email";
import { generateWithGemini } from "./gemini";
import type { ChatDeps } from "./handler";
import { type ChatLimits, memoryLimits, redisLimits } from "./limits";
import {
  type ChatStore,
  MemoryChatStore,
  RedisChatStore,
  redisFromEnv,
} from "./store";
import { turnstileFromEnv } from "./turnstile";
import { allowedOriginsFromEnv, ipSaltFromEnv } from "./visitor";

/**
 * The real parts of the chat, made from the environment variables: Upstash
 * Redis for the conversations and the limits, Gemini for the answers,
 * Turnstile against bots.
 *
 * Without Upstash, local development (npm run dev) uses stand-ins kept in
 * memory, so the chat can be tried with only GEMINI_API_KEY. In production
 * they are never used: a missing setting turns the chat off with a log entry.
 */
export function chatDepsFromEnv(): ChatDeps {
  const redis = redisFromEnv();
  const local = process.env.NODE_ENV !== "production";
  const memory = local ? memoryParts() : null;

  return {
    store: redis ? new RedisChatStore(redis) : (memory?.store ?? null),
    limits: redis ? redisLimits(redis) : (memory?.limits ?? null),
    generate: generateWithGemini,
    verifyHuman: turnstileFromEnv(),
    salt: ipSaltFromEnv(),
    allowedOrigins: allowedOriginsFromEnv(),
    development: process.env.NODE_ENV === "development",
  };
}

/**
 * The parts the email routes need. Without Gmail settings, local
 * development writes the emails to the terminal instead.
 */
export function deliveryDepsFromEnv(): DeliveryDeps {
  const redis = redisFromEnv();
  const local = process.env.NODE_ENV !== "production";

  return {
    store: redis
      ? new RedisChatStore(redis)
      : local
        ? memoryParts().store
        : null,
    mailer: gmailFromEnv() ?? (local ? terminalMailer : null),
    allowedOrigins: allowedOriginsFromEnv(),
    development: process.env.NODE_ENV === "development",
  };
}

// Kept on globalThis, so the stand-ins keep their contents while npm run dev
// reloads the code after a change.
const shared = globalThis as typeof globalThis & {
  chatMemory?: { store: ChatStore; limits: ChatLimits };
};

function memoryParts() {
  shared.chatMemory ??= {
    store: new MemoryChatStore(),
    limits: memoryLimits(),
  };
  return shared.chatMemory;
}
