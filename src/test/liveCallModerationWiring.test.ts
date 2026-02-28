import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("live call moderation wiring", () => {
  it("includes transcript payload and browser speech fallback handling", () => {
    const filePath = resolve(process.cwd(), "src/pages/LiveCall.tsx");
    const code = readFileSync(filePath, "utf8");

    expect(code).toContain("SpeechRecognition");
    expect(code).toContain("webkitSpeechRecognition");
    expect(code).toContain("transcript: textToSend");
    expect(code).toContain("transcript_available: transcriptAvailable");
  });
});
