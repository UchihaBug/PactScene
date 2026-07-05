import type { InputEnvelope, OcrAdapter, OcrInput, SpeechAdapter, SpeechInput } from "./types.js";

export interface MockOcrAdapterOptions {
  textBySource?: Record<string, string>;
  defaultText?: string;
}

export interface MockSpeechAdapterOptions {
  textBySource?: Record<string, string>;
  defaultText?: string;
  language?: string;
}

export function createMockOcrAdapter(options: MockOcrAdapterOptions = {}): OcrAdapter {
  return {
    name: "mock-ocr",
    async recognize(input: OcrInput): Promise<InputEnvelope> {
      const text = resolveMockText(input.sourceUri, input.hint, options.textBySource, options.defaultText || "show open orders this month");
      return {
        kind: "image_ocr",
        text,
        evidence: {
          provider: "mock-ocr",
          confidence: 0.99,
          sourceUri: input.sourceUri,
          blocks: [
            {
              text,
              confidence: 0.99,
              box: { x: 0, y: 0, width: 640, height: 96 }
            }
          ]
        }
      };
    }
  };
}

export function createMockSpeechAdapter(options: MockSpeechAdapterOptions = {}): SpeechAdapter {
  return {
    name: "mock-speech",
    async transcribe(input: SpeechInput): Promise<InputEnvelope> {
      const text = resolveMockText(input.sourceUri, input.hint, options.textBySource, options.defaultText || "find critical incidents");
      return {
        kind: "audio_transcript",
        text,
        evidence: {
          provider: "mock-speech",
          confidence: 0.98,
          language: input.languageHint || options.language || "en",
          sourceUri: input.sourceUri,
          segments: [
            {
              text,
              startMs: 0,
              endMs: Math.max(800, text.length * 40),
              confidence: 0.98
            }
          ]
        }
      };
    }
  };
}

function resolveMockText(sourceUri: string | undefined, hint: string | undefined, textBySource: Record<string, string> = {}, fallback: string): string {
  if (hint?.trim()) return hint.trim();
  if (sourceUri && textBySource[sourceUri]) return textBySource[sourceUri];
  return fallback;
}

