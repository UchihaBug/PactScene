import { planGraphMessage, type AiAssistantResponse, type AiSceneContract, type AiSceneDefinition, type Payload, type SceneGraphDefinition } from "@pactscene/core";
import { mergeInputMetadata, normalizeInputText } from "./normalize.js";
import type { InputEnvelope, InputNormalizationOptions } from "./types.js";

export interface PlanInputOptions extends InputNormalizationOptions {
  facts?: Payload;
}

export function planInputEnvelope(
  envelope: InputEnvelope,
  scenes: AiSceneDefinition[],
  contracts: AiSceneContract[],
  graph: SceneGraphDefinition,
  options: PlanInputOptions = {}
): AiAssistantResponse {
  const normalized = mergeInputMetadata(envelope, options);
  const facts: Payload = {
    inputKind: normalized.kind,
    inputProvider: normalized.evidence?.provider,
    inputConfidence: normalized.evidence?.confidence,
    inputLanguage: normalized.evidence?.language,
    ...options.facts
  };

  return planGraphMessage(normalizeInputText(normalized), scenes, contracts, graph, { facts });
}

