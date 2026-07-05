import type {
  AiAssistantResponse,
  AiQueryDispatchCard,
  AiSceneContract,
  AiSceneDefinition,
  AiSceneFormCard,
  Payload
} from "./types.js";
import { collectSuggestions } from "./registry.js";
import { sanitizePayload } from "./sanitize.js";

export function buildQueryDispatchCard(
  scene: AiSceneDefinition,
  rawPayload: Payload,
  contracts: AiSceneContract[],
  parser = "demo-rule"
): AiQueryDispatchCard {
  const fixedParams = scene.query?.fixedParams || {};
  const sanitized = sanitizePayload(scene.code, { ...rawPayload, ...fixedParams }, contracts, "query");

  return {
    type: "query_dispatch",
    sceneCode: scene.code,
    prefill: sanitized.payload,
    rejectedFields: sanitized.rejectedFields,
    metadata: {
      sceneType: "query",
      mode: scene.host?.mode || "embed_query",
      intent: scene.intent,
      parser,
      contractMode: "scene_contract",
      contractVersion: sanitized.contractVersion
    }
  };
}

export function buildSceneFormCard(
  scene: AiSceneDefinition,
  rawDraft: Payload,
  contracts: AiSceneContract[],
  parser = "demo-rule"
): AiSceneFormCard {
  const sanitized = sanitizePayload(scene.code, rawDraft, contracts, "create");

  return {
    type: "scene_form",
    sceneCode: scene.code,
    draft: sanitized.payload,
    missingFields: sanitized.missingFields,
    rejectedFields: sanitized.rejectedFields,
    metadata: {
      sceneType: "create",
      mode: scene.host?.mode || "embed_form",
      intent: scene.intent,
      parser,
      contractMode: "scene_contract",
      contractVersion: sanitized.contractVersion
    }
  };
}

export function buildUnknownResponse(scenes: AiSceneDefinition[]): AiAssistantResponse {
  return {
    reply: "I could not match that request to a registered scene. Try one of the safe demo prompts.",
    cards: [],
    suggestions: collectSuggestions(scenes)
  };
}
