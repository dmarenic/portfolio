import { describe, expect, it } from "vitest";
import { profile } from "@/content/site";
import { buildKnowledge, buildSystemInstruction } from "./knowledge";

describe("knowledge of the assistant", () => {
  const knowledge = buildKnowledge();

  it("is built from the data of the site", () => {
    expect(knowledge).toContain(profile.email);
    expect(knowledge).toContain(profile.github);
    expect(knowledge).toContain("Online Trivia Quiz");
    expect(knowledge).toContain("RateMyMeal");
    expect(knowledge).toContain("Blue Pulse");
    expect(knowledge).toContain("GROW d.o.o.");
    expect(knowledge).toContain(profile.summary.text.hr);
  });

  it("lists every skill of the site, without levels", () => {
    expect(knowledge).toContain(
      "Tools & other languages (Alati i ostali jezici): Git, C, Kotlin, Docker, GitHub Actions",
    );
    expect(knowledge).not.toContain("Basics");
  });

  it("has no phone number", () => {
    // Nine or more digits, maybe split by spaces, slashes or dashes. Years
    // such as "2023-2026" have only eight.
    const phone = /\+?\d(?:[\s/-]?\d){8,}/;
    expect("Call +385 00 000 0000").toMatch(phone);
    expect(knowledge).not.toMatch(phone);
  });

  it("puts the rules before the knowledge", () => {
    const instruction = buildSystemInstruction();
    expect(instruction.indexOf("RULES")).toBeLessThan(
      instruction.indexOf("KNOWLEDGE"),
    );
    expect(instruction).toContain("third person");
  });
});
