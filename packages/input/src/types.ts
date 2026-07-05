import type { JsonValue, Payload } from "@pactscene/core";

export type InputKind = "text" | "image_ocr" | "audio_transcript";

export interface InputEvidence {
  provider?: string;
  confidence?: number;
  language?: string;
  sourceUri?: string;
  blocks?: OcrBlock[];
  segments?: SpeechSegment[];
  [key: string]: JsonValue | OcrBlock[] | SpeechSegment[] | undefined;
}

export interface InputEnvelope {
  kind: InputKind;
  text: string;
  evidence?: InputEvidence;
  metadata?: Payload;
}

export interface OcrBlock {
  text: string;
  confidence?: number;
  box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SpeechSegment {
  text: string;
  startMs?: number;
  endMs?: number;
  confidence?: number;
}

export interface OcrInput {
  bytes?: Uint8Array;
  mimeType?: string;
  sourceUri?: string;
  hint?: string;
}

export interface SpeechInput {
  bytes?: Uint8Array;
  mimeType?: string;
  sourceUri?: string;
  languageHint?: string;
  hint?: string;
}

export interface OcrAdapter {
  name: string;
  recognize(input: OcrInput): Promise<InputEnvelope>;
}

export interface SpeechAdapter {
  name: string;
  transcribe(input: SpeechInput): Promise<InputEnvelope>;
}

export interface InputNormalizationOptions {
  defaultLanguage?: string;
  metadata?: Payload;
}

