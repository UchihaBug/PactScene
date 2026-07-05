# Input Adapters

PactScene can accept text, OCR, and speech input through a small normalization layer.

The input flow is:

```text
image or audio
  -> adapter
  -> InputEnvelope
  -> normalized text and evidence
  -> scene graph planner
  -> contract-safe card
```

## Packages

- `@pactscene/input`: shared input types, normalization helpers, mock OCR, mock speech, and `planInputEnvelope`.
- `@pactscene/core`: scene graph planner, rule engine, contract sanitizer, and card protocol.

## Why Adapters Are Separate

The framework should not depend on a specific OCR or speech vendor. Real providers can be added by implementing:

- `OcrAdapter`
- `SpeechAdapter`

The adapter should return an `InputEnvelope` with normalized text plus evidence such as confidence, source URI, OCR blocks, or speech segments.

## Mock OCR Example

```ts
import { createMockOcrAdapter, planInputEnvelope } from "@pactscene/input";

const ocr = createMockOcrAdapter({
  defaultText: "show open orders this month"
});

const envelope = await ocr.recognize({ sourceUri: "mock://order-screenshot" });
const response = planInputEnvelope(envelope, scenes, contracts, graph);
```

## Mock Speech Example

```ts
import { createMockSpeechAdapter, planInputEnvelope } from "@pactscene/input";

const speech = createMockSpeechAdapter({
  defaultText: "find critical incidents"
});

const envelope = await speech.transcribe({ sourceUri: "mock://incident-audio" });
const response = planInputEnvelope(envelope, scenes, contracts, graph);
```

## Vendor Integration

A real OCR or speech provider should live in an optional adapter package or in an application repository:

```text
@pactscene/input-openai
@pactscene/input-tesseract
my-product-app/src/adapters/speech.ts
```

Do not commit provider keys, private prompts, or private sample files into the public framework repository.

