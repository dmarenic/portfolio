import { chatDepsFromEnv } from "@/lib/chatbot/deps";
import { handleChat } from "@/lib/chatbot/handler";

// POST /api/chat: one message of the chat, answered by Gemini. Runs only on
// the server (a Vercel Function); the logic is in lib/chatbot/handler.ts.
// Only POST is exported, so any other method gets 405 Method Not Allowed.

// Every request is answered fresh, never from a cache.
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleChat(request, chatDepsFromEnv());
}
