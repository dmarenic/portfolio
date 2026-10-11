import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { answerSettings, geminiModel } from "./config";
import { buildSystemInstruction } from "./knowledge";
import type { Turn } from "./store";

/*
 * The call to Gemini, the same way the admin panel of Online Trivia Quiz
 * does it: the official @google/genai package, the key from GEMINI_API_KEY
 * on the server, and on any error the details go only to the server log
 * while the visitor gets a friendly message (see handler.ts).
 *
 * Two differences: the rules and the knowledge go into systemInstruction,
 * kept apart from the visitor's messages, and the answer is streamed, so the
 * visitor sees it appear as it is written.
 */

export type GenerateInput = {
  // Earlier questions and answers, oldest first, as stored on the server.
  history: Turn[];
  message: string;
  signal: AbortSignal;
};

/** Yields the answer in pieces as Gemini writes it. */
export type Generate = (input: GenerateInput) => AsyncIterable<string>;

export async function* generateWithGemini({
  history,
  message,
  signal,
}: GenerateInput): AsyncIterable<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });
  const stream = await ai.models.generateContentStream({
    model: geminiModel(),
    contents: [
      ...history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ],
    config: {
      systemInstruction: buildSystemInstruction(),
      maxOutputTokens: answerSettings.maxOutputTokens,
      temperature: answerSettings.temperature,
      // Thinking tokens count towards maxOutputTokens, and short answers
      // from given facts need almost no thinking, so it is kept minimal.
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      abortSignal: signal,
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}
