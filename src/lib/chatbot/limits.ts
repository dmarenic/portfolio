import { Ratelimit } from "@upstash/ratelimit";
import type { Redis } from "@upstash/redis";

/*
 * Limits on the number of messages, so the chat cannot be flooded and the
 * cost of Gemini stays under control. Every number can be changed with an
 * environment variable (see .env.example):
 *
 *   per visitor   10 messages in 10 minutes  CHAT_LIMIT_PER_10_MIN
 *                 40 messages a day          CHAT_LIMIT_PER_DAY
 *   per chat      20 messages                CHAT_LIMIT_PER_CONVERSATION
 *   whole site   300 messages a day          CHAT_LIMIT_SITE_PER_DAY
 *
 * The counters live in Upstash Redis (@upstash/ratelimit), because a counter
 * in memory would start from zero in every new copy of the function. The
 * limit per chat is counted from the stored messages instead (handler.ts).
 */

/** Counts one message for `id` and says whether it is still allowed. */
export type Limiter = { limit(id: string): Promise<{ success: boolean }> };

export type ChatLimits = {
  perTenMinutes: Limiter;
  perDay: Limiter;
  sitePerDay: Limiter;
  perConversation: number;
};

function numberFromEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export function limitSettings() {
  return {
    perTenMinutes: numberFromEnv("CHAT_LIMIT_PER_10_MIN", 10),
    perDay: numberFromEnv("CHAT_LIMIT_PER_DAY", 40),
    perConversation: numberFromEnv("CHAT_LIMIT_PER_CONVERSATION", 20),
    sitePerDay: numberFromEnv("CHAT_LIMIT_SITE_PER_DAY", 300),
  };
}

/** The limits kept in Upstash Redis. */
export function redisLimits(redis: Redis): ChatLimits {
  const settings = limitSettings();

  const limiter = (
    name: string,
    algorithm: ReturnType<typeof Ratelimit.fixedWindow>,
  ): Limiter => {
    const ratelimit = new Ratelimit({
      redis,
      limiter: algorithm,
      prefix: `chat:limit:${name}`,
    });
    return {
      async limit(id) {
        const result = await ratelimit.limit(id);
        // Finishes any background work of the library before the function
        // ends.
        await result.pending;
        return { success: result.success };
      },
    };
  };

  return {
    // A sliding window: never more than 10 in any 10 minutes.
    perTenMinutes: limiter(
      "10min",
      Ratelimit.slidingWindow(settings.perTenMinutes, "10 m"),
    ),
    // Fixed windows: the count starts again every day at midnight UTC.
    perDay: limiter("day", Ratelimit.fixedWindow(settings.perDay, "1 d")),
    sitePerDay: limiter(
      "site",
      Ratelimit.fixedWindow(settings.sitePerDay, "1 d"),
    ),
    perConversation: settings.perConversation,
  };
}

/** A simple counter kept in memory, for local development and the tests. */
export class MemoryLimiter implements Limiter {
  private readonly windows = new Map<
    string,
    { count: number; resetAt: number }
  >();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  async limit(id: string) {
    const now = this.now();
    let window = this.windows.get(id);
    if (!window || window.resetAt <= now) {
      window = { count: 0, resetAt: now + this.windowMs };
      this.windows.set(id, window);
    }
    window.count += 1;
    return { success: window.count <= this.max };
  }
}

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function memoryLimits(): ChatLimits {
  const settings = limitSettings();
  return {
    perTenMinutes: new MemoryLimiter(settings.perTenMinutes, 10 * MINUTE),
    perDay: new MemoryLimiter(settings.perDay, DAY),
    sitePerDay: new MemoryLimiter(settings.sitePerDay, DAY),
    perConversation: settings.perConversation,
  };
}
