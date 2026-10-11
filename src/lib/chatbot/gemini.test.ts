import { describe, expect, it, vi } from "vitest";

/*
 * The real Gemini client is replaced by a mock, so this checks only what the
 * site sends to Gemini: the model, the settings, the rules and the history.
 */

const generateContentStream = vi.fn(async () =>
  (async function* () {
    yield { text: "Hello" };
    yield { text: "" };
    yield { text: " there" };
  })(),
);

vi.mock("@google/genai", async (importOriginal) => {
  const original = await importOriginal<typeof import("@google/genai")>();
  return {
    ...original,
    GoogleGenAI: class {
      models = { generateContentStream };
    },
  };
});

const { generateWithGemini } = await import("./gemini");

describe("generateWithGemini", () => {
  it("sends the rules, the history and the settings", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const pieces: string[] = [];
    for await (const piece of generateWithGemini({
      history: [
        { role: "user", text: "Hi", at: "" },
        { role: "model", text: "Hello!", at: "" },
      ],
      message: "What tech stack do you use?",
      signal: new AbortController().signal,
    })) {
      pieces.push(piece);
    }

    // Empty pieces are skipped.
    expect(pieces).toEqual(["Hello", " there"]);

    const [request] = generateContentStream.mock.calls[0] as unknown as [
      {
        model: string;
        contents: { role: string; parts: { text: string }[] }[];
        config: Record<string, unknown>;
      },
    ];
    expect(request.model).toBe("gemini-3.1-flash-lite");
    expect(request.contents.map((c) => [c.role, c.parts[0].text])).toEqual([
      ["user", "Hi"],
      ["model", "Hello!"],
      ["user", "What tech stack do you use?"],
    ]);
    expect(request.config.maxOutputTokens).toBe(400);
    expect(request.config.temperature).toBe(0.4);
    expect(String(request.config.systemInstruction)).toContain("KNOWLEDGE");
    vi.unstubAllEnvs();
  });

  it("uses GEMINI_MODEL when it is set", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("GEMINI_MODEL", "gemini-3.5-flash-lite");
    generateContentStream.mockClear();
    for await (const piece of generateWithGemini({
      history: [],
      message: "Hi",
      signal: new AbortController().signal,
    })) {
      expect(piece).toBeTruthy();
    }
    const [request] = generateContentStream.mock.calls[0] as unknown as [
      { model: string },
    ];
    expect(request.model).toBe("gemini-3.5-flash-lite");
    vi.unstubAllEnvs();
  });
});
