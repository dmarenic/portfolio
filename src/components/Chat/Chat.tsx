import fs from "node:fs";
import path from "node:path";
import { chatbot, ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { isChatEnabled } from "@/lib/chatbot/config";
import { ChatLauncher } from "./ChatLauncher";
import type { ChatTexts } from "./types";

/*
 * The AI assistant in the bottom right corner. This part runs on the server
 * (at build time, because the pages are static): it picks the text in the
 * page's language and looks for a picture of the assistant. The button and
 * the window run in the browser (ChatLauncher, ChatWindow).
 *
 * CHAT_ENABLED=false hides the button (after the next build) and turns off
 * the API route right away (see lib/chatbot/config.ts).
 */
export function Chat({ locale }: { locale: Locale }) {
  if (!isChatEnabled()) return null;

  const texts: ChatTexts = {
    name: chatbot.name,
    badge: chatbot.badge,
    subtitle: chatbot.subtitle[locale],
    open: chatbot.open[locale],
    close: chatbot.close[locale],
    newChat: chatbot.newChat[locale],
    greeting: chatbot.greeting[locale],
    tryAsking: chatbot.tryAsking[locale],
    suggestions: chatbot.suggestions.map((question) => question[locale]),
    placeholder: chatbot.placeholder[locale],
    inputLabel: chatbot.inputLabel[locale],
    send: chatbot.send[locale],
    you: chatbot.you[locale],
    typing: chatbot.typing[locale],
    disclaimer: chatbot.disclaimer[locale],
    error: chatbot.errors.unavailable[locale],
    newTab: ui.newTab[locale],
  };

  return (
    <ChatLauncher
      locale={locale}
      texts={texts}
      avatarSrc={findAvatar()}
      // The Turnstile site key is public by design (Cloudflare shows it in
      // the page), unlike TURNSTILE_SECRET_KEY, which stays on the server.
      turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null}
    />
  );
}

// A picture saved as public/chatbot/avatar.png (or .webp or .svg) replaces
// the DM monogram. Checked at build time, so a new picture needs a new build.
const AVATAR_FILES = ["avatar.png", "avatar.webp", "avatar.svg"];

function findAvatar(): string | null {
  const file = AVATAR_FILES.find((name) =>
    fs.existsSync(path.join(process.cwd(), "public", "chatbot", name)),
  );
  return file ? `/chatbot/${file}` : null;
}
