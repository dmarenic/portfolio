import { deliveryDepsFromEnv } from "@/lib/chatbot/deps";
import { handleCron } from "@/lib/chatbot/delivery";

// GET /api/chat/cron: the daily backup job (see vercel.json), which emails
// the conversations that got no signal from the browser. Protected with
// CRON_SECRET. See lib/chatbot/delivery.ts.

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return handleCron(request, deliveryDepsFromEnv());
}
