import { deliveryDepsFromEnv } from "@/lib/chatbot/deps";
import { handleEnd } from "@/lib/chatbot/delivery";

// POST /api/chat/end: the browser's signal that a conversation ended, so it
// can be emailed to Dominik. See lib/chatbot/delivery.ts.

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleEnd(request, deliveryDepsFromEnv());
}
