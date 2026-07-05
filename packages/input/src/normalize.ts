import type { InputEnvelope, InputNormalizationOptions } from "./types.js";

export function textInput(text: string, options: InputNormalizationOptions = {}): InputEnvelope {
  return {
    kind: "text",
    text: text.trim(),
    evidence: {
      provider: "direct",
      language: options.defaultLanguage
    },
    metadata: options.metadata
  };
}

export function normalizeInputText(envelope: InputEnvelope): string {
  return envelope.text.trim();
}

export function mergeInputMetadata(envelope: InputEnvelope, options: InputNormalizationOptions = {}): InputEnvelope {
  return {
    ...envelope,
    evidence: {
      ...envelope.evidence,
      language: envelope.evidence?.language || options.defaultLanguage
    },
    metadata: {
      ...options.metadata,
      ...envelope.metadata
    }
  };
}

