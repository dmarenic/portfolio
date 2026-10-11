import { Redis } from "@upstash/redis";
import type { Locale } from "@/lib/i18n";
import { conversationTtlSeconds } from "./config";

/*
 * Where conversations are kept on the server.
 *
 * On Vercel every request can run in a different short-lived copy of the
 * function, so nothing kept in memory survives from one message to the next.
 * The conversations are therefore stored in Upstash Redis, a database that
 * the function reaches over HTTPS. Every conversation expires 48 hours after
 * its last message.
 *
 * Without Upstash settings, local development (npm run dev) and the tests use
 * a copy kept in memory, so the chat can be tried with only a Gemini key.
 */

/** One message of a conversation, as stored. */
export type Turn = {
  role: "user" | "model";
  text: string;
  // ISO date and time.
  at: string;
  // The model did not answer; the visitor got a message from the site.
  failed?: true;
};

export type ConversationMeta = {
  startedAt: string;
  locale: Locale;
  // The page the first message was written from.
  page: string;
};

export type StoredConversation = {
  meta: ConversationMeta;
  turns: Turn[];
  // How many of the turns have already been emailed to Dominik.
  emailedTurns: number;
};

export interface ChatStore {
  get(id: string): Promise<StoredConversation | null>;
  start(id: string, meta: ConversationMeta): Promise<void>;
  /** Saves a question and its answer, and restarts the 48 hours. */
  addExchange(id: string, question: Turn, answer: Turn): Promise<void>;
  /** Ids of the conversations that had a message in the last 48 hours. */
  recent(): Promise<string[]>;
  /** Forgets a conversation in recent() once it has expired. */
  forget(id: string): Promise<void>;
  markEmailed(id: string, turns: number): Promise<void>;
  /**
   * Makes sure only one request emails a conversation at a time (the
   * signal from the browser and the daily job could meet). Returns false
   * when another request holds the lock; it frees itself after a minute.
   */
  lock(id: string): Promise<boolean>;
  unlock(id: string): Promise<void>;
}

// Keys in Redis, for each conversation:
//   chat:<id>:meta     an object (ConversationMeta)
//   chat:<id>:turns    a list of Turn objects
//   chat:<id>:emailed  how many turns have been emailed
//   chat:<id>:lock     present while an email is being sent
// and chat:recent, a sorted set of conversation ids by the time of their
// last message, which the daily job goes through.
const key = (id: string, part: string) => `chat:${id}:${part}`;
const RECENT = "chat:recent";

export class RedisChatStore implements ChatStore {
  constructor(private readonly redis: Redis) {}

  async get(id: string) {
    // The Upstash client turns the stored JSON back into objects.
    const [meta, turns, emailed] = await Promise.all([
      this.redis.get<ConversationMeta>(key(id, "meta")),
      this.redis.lrange<Turn>(key(id, "turns"), 0, -1),
      this.redis.get<number>(key(id, "emailed")),
    ]);
    return meta ? { meta, turns, emailedTurns: emailed ?? 0 } : null;
  }

  async start(id: string, meta: ConversationMeta) {
    // nx: only if the conversation does not exist yet.
    await this.redis.set(key(id, "meta"), meta, {
      ex: conversationTtlSeconds,
      nx: true,
    });
  }

  async addExchange(id: string, question: Turn, answer: Turn) {
    // multi: all of these run together, one after another, in one request.
    await this.redis
      .multi()
      .rpush(key(id, "turns"), question, answer)
      .expire(key(id, "turns"), conversationTtlSeconds)
      .expire(key(id, "meta"), conversationTtlSeconds)
      .expire(key(id, "emailed"), conversationTtlSeconds)
      .zadd(RECENT, { score: Date.now(), member: id })
      .exec();
  }

  async recent() {
    return this.redis.zrange<string[]>(RECENT, 0, -1);
  }

  async forget(id: string) {
    await this.redis.zrem(RECENT, id);
  }

  async markEmailed(id: string, turns: number) {
    await this.redis.set(key(id, "emailed"), turns, {
      ex: conversationTtlSeconds,
    });
  }

  async lock(id: string) {
    const result = await this.redis.set(key(id, "lock"), 1, {
      nx: true,
      ex: 60,
    });
    return result === "OK";
  }

  async unlock(id: string) {
    await this.redis.del(key(id, "lock"));
  }
}

/** The same store kept in memory, for local development and the tests. */
export class MemoryChatStore implements ChatStore {
  private readonly conversations = new Map<string, StoredConversation>();
  private readonly locks = new Set<string>();

  async get(id: string) {
    const conversation = this.conversations.get(id);
    return conversation ? structuredClone(conversation) : null;
  }

  async start(id: string, meta: ConversationMeta) {
    if (!this.conversations.has(id)) {
      this.conversations.set(id, { meta, turns: [], emailedTurns: 0 });
    }
  }

  async addExchange(id: string, question: Turn, answer: Turn) {
    this.conversations.get(id)?.turns.push(question, answer);
  }

  async recent() {
    return [...this.conversations.keys()];
  }

  async forget(id: string) {
    this.conversations.delete(id);
  }

  async markEmailed(id: string, turns: number) {
    const conversation = this.conversations.get(id);
    if (conversation) conversation.emailedTurns = turns;
  }

  async lock(id: string) {
    if (this.locks.has(id)) return false;
    this.locks.add(id);
    return true;
  }

  async unlock(id: string) {
    this.locks.delete(id);
  }
}

/**
 * The Redis client, when Upstash is set up. Redis.fromEnv() reads
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, or the KV_REST_API_URL
 * and KV_REST_API_TOKEN that the Vercel integration creates.
 */
export function redisFromEnv(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? Redis.fromEnv() : null;
}
