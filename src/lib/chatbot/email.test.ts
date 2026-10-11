import { afterEach, describe, expect, it, vi } from "vitest";
import { type DeliveryDeps, handleCron, handleEnd } from "./delivery";
import {
  composeEmail,
  type Email,
  emailNewMessages,
  escapeHtml,
  type Mailer,
} from "./email";
import { MemoryChatStore, type Turn } from "./store";

const ORIGIN = "https://dominik-marenic.vercel.app";

afterEach(() => {
  vi.unstubAllEnvs();
});

function fakeMailer() {
  const sent: Email[] = [];
  const mailer: Mailer = {
    async send(email) {
      sent.push(email);
    },
  };
  return { mailer, sent };
}

const turn = (role: Turn["role"], text: string): Turn => ({
  role,
  text,
  at: "2026-10-11T12:00:00.000Z",
});

async function storeWithConversation(id: string, texts: string[]) {
  const store = new MemoryChatStore();
  await store.start(id, {
    startedAt: "2026-10-11T12:00:00.000Z",
    locale: "hr",
    page: "/hr",
  });
  for (let i = 0; i < texts.length; i += 2) {
    await store.addExchange(
      id,
      turn("user", texts[i]),
      turn("model", texts[i + 1]),
    );
  }
  return store;
}

describe("the email", () => {
  it("escapes everything the visitor wrote", () => {
    const email = composeEmail(
      { startedAt: "2026-10-11T12:00:00.000Z", locale: "en", page: "/" },
      [turn("user", `<img src=x onerror="alert(1)"> & 'hi'`)],
      false,
    );
    expect(email.html).not.toContain("<img");
    expect(email.html).toContain(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;hi&#39;",
    );
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("has the subject, the time, the language and the page", () => {
    const email = composeEmail(
      { startedAt: "2026-10-11T12:00:00.000Z", locale: "hr", page: "/hr" },
      [turn("user", "Bok"), turn("model", "Bok!")],
      false,
    );
    expect(email.subject).toBe("Novi razgovor s Dominik AI");
    expect(email.text).toContain("Jezik: hrvatski");
    expect(email.text).toContain(`Stranica: ${ORIGIN}/hr`);
    // 12:00 UTC is 14:00 in Croatia in October.
    expect(email.text).toContain("14:00");
    expect(email.text).toContain("Posjetitelj");
  });
});

describe("emailing a conversation", () => {
  it("emails every message only once", async () => {
    const id = crypto.randomUUID();
    const store = await storeWithConversation(id, ["Pitanje 1", "Odgovor 1"]);
    const { mailer, sent } = fakeMailer();

    expect(await emailNewMessages(id, store, mailer)).toBe("sent");
    expect(await emailNewMessages(id, store, mailer)).toBe("nothing new");
    expect(sent).toHaveLength(1);

    // The visitor comes back: only the new messages are emailed.
    await store.addExchange(
      id,
      turn("user", "Pitanje 2"),
      turn("model", "Odgovor 2"),
    );
    expect(await emailNewMessages(id, store, mailer)).toBe("sent");
    expect(sent[1].text).toContain("Pitanje 2");
    expect(sent[1].text).not.toContain("Pitanje 1");
    expect(sent[1].text).toContain("nastavio razgovor");
  });

  it("does not email the same conversation twice at the same time", async () => {
    const id = crypto.randomUUID();
    const store = await storeWithConversation(id, ["Pitanje", "Odgovor"]);
    const { mailer, sent } = fakeMailer();

    const results = await Promise.all([
      emailNewMessages(id, store, mailer),
      emailNewMessages(id, store, mailer),
    ]);
    expect(results.sort()).toEqual(["busy", "sent"]);
    expect(sent).toHaveLength(1);
  });
});

describe("POST /api/chat/end", () => {
  const deps = (overrides: Partial<DeliveryDeps> = {}): DeliveryDeps => ({
    store: new MemoryChatStore(),
    mailer: fakeMailer().mailer,
    allowedOrigins: [ORIGIN],
    development: false,
    ...overrides,
  });

  const beacon = (body: string, origin: string | null = ORIGIN) => {
    const headers = new Headers({ "content-type": "text/plain;charset=UTF-8" });
    if (origin) headers.set("origin", origin);
    return new Request(`${ORIGIN}/api/chat/end`, {
      method: "POST",
      headers,
      body,
    });
  };

  it("emails the conversation named by the browser", async () => {
    const id = crypto.randomUUID();
    const store = await storeWithConversation(id, ["Pitanje", "Odgovor"]);
    const { mailer, sent } = fakeMailer();

    const response = await handleEnd(
      beacon(JSON.stringify({ conversationId: id })),
      deps({ store, mailer }),
    );
    expect(response.status).toBe(204);
    expect(sent).toHaveLength(1);
  });

  it("ignores any messages sent by the browser", async () => {
    const response = await handleEnd(
      beacon(
        JSON.stringify({
          conversationId: crypto.randomUUID(),
          messages: [{ role: "user", text: "fake" }],
        }),
      ),
      deps(),
    );
    expect(response.status).toBe(400);
  });

  it("refuses other sites", async () => {
    const response = await handleEnd(
      beacon(JSON.stringify({ conversationId: crypto.randomUUID() }), null),
      deps(),
    );
    expect(response.status).toBe(403);
  });
});

describe("GET /api/chat/cron", () => {
  const cron = (authorization?: string) =>
    new Request(`${ORIGIN}/api/chat/cron`, {
      headers: authorization ? { authorization } : {},
    });

  it("refuses requests without the secret", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret-value");
    const deps: DeliveryDeps = {
      store: new MemoryChatStore(),
      mailer: fakeMailer().mailer,
      allowedOrigins: [],
      development: false,
    };
    expect((await handleCron(cron(), deps)).status).toBe(401);
    expect((await handleCron(cron("Bearer wrong"), deps)).status).toBe(401);
  });

  it("emails the conversations that were not emailed yet", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret-value");
    const id = crypto.randomUUID();
    const store = await storeWithConversation(id, ["Pitanje", "Odgovor"]);
    const { mailer, sent } = fakeMailer();
    const deps: DeliveryDeps = {
      store,
      mailer,
      allowedOrigins: [],
      development: false,
    };

    const response = await handleCron(cron("Bearer s3cret-value"), deps);
    expect(await response.json()).toEqual({ sent: 1 });
    expect(sent).toHaveLength(1);

    const again = await handleCron(cron("Bearer s3cret-value"), deps);
    expect(await again.json()).toEqual({ sent: 0 });
  });
});
