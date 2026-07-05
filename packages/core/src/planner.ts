import type { AiAssistantResponse, AiSceneContract, AiSceneDefinition, Payload } from "./types.js";
import { buildQueryDispatchCard, buildSceneFormCard, buildUnknownResponse } from "./cards.js";
import { collectSuggestions } from "./registry.js";

export interface DemoPlannerOptions {
  today?: Date;
}

export function planDemoMessage(
  message: string,
  scenes: AiSceneDefinition[],
  contracts: AiSceneContract[],
  options: DemoPlannerOptions = {}
): AiAssistantResponse {
  const normalized = message.trim().toLowerCase();
  if (!normalized) return buildUnknownResponse(scenes);

  const scene = chooseScene(normalized, scenes);
  if (!scene) return buildUnknownResponse(scenes);

  if (scene.sceneType === "query") {
    const rawPayload = extractQueryPayload(normalized, options.today || new Date());
    const card = buildQueryDispatchCard(scene, rawPayload, contracts);
    return {
      reply: `Matched ${scene.label} and sanitized the query payload with contract ${card.metadata.contractVersion}.`,
      cards: [card],
      suggestions: scene.suggestions || collectSuggestions(scenes)
    };
  }

  const rawDraft = extractCreateDraft(normalized);
  const card = buildSceneFormCard(scene, rawDraft, contracts);
  return {
    reply: `Matched ${scene.label}. The draft is controlled by contract ${card.metadata.contractVersion}.`,
    cards: [card],
    suggestions: scene.suggestions || collectSuggestions(scenes)
  };
}

function chooseScene(message: string, scenes: AiSceneDefinition[]): AiSceneDefinition | undefined {
  const scored = scenes
    .map((scene) => {
      const hints = scene.promptHints || [];
      const score = hints.reduce((total, hint) => total + (message.includes(hint.toLowerCase()) ? 1 : 0), 0);
      return { scene, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.scene;
}

function extractQueryPayload(message: string, today: Date): Payload {
  const payload: Payload = {};

  if (/(open|active|new)/.test(message)) payload.status = "open";
  if (/(processing|in progress)/.test(message)) payload.status = "processing";
  if (/(shipped|delivered)/.test(message)) payload.status = "shipped";
  if (/(critical|severe|sev1)/.test(message)) payload.severity = "critical";
  if (/(normal|medium)/.test(message)) payload.severity = "normal";
  if (/(low|minor)/.test(message)) payload.severity = "low";
  if (/(waiting|blocked)/.test(message)) payload.status = "waiting";
  if (/(closed|resolved)/.test(message)) payload.status = "closed";
  if (/(me|assigned to me|my queue)/.test(message)) payload.owner = "me";
  if (/(north|northern)/.test(message)) payload.region = "north";
  if (/(south|southern)/.test(message)) payload.region = "south";
  if (/(west|western)/.test(message)) payload.region = "west";

  if (/(this month|current month)/.test(message)) {
    const range = monthRange(today);
    payload.startDate = range.startDate;
    payload.endDate = range.endDate;
  }

  const amountMatch = message.match(/(?:above|over|greater than)\s*(\d+(?:\.\d+)?)/);
  if (amountMatch) payload.minAmount = Number(amountMatch[1]);

  return payload;
}

function extractCreateDraft(message: string): Payload {
  const draft: Payload = {};
  if (/(software|saas|platform)/.test(message)) draft.industry = "software";
  if (/(healthcare|medical|clinic)/.test(message)) draft.industry = "healthcare";
  if (/(education|school|university)/.test(message)) draft.industry = "education";
  if (/(high priority|important|urgent)/.test(message)) draft.priority = "high";
  if (/(low priority)/.test(message)) draft.priority = "low";
  if (draft.priority === undefined) draft.priority = "normal";

  const companyMatch = message.match(/(?:for|from|company)\s+([a-z][a-z0-9 &.-]{1,40})/i);
  if (companyMatch) draft.company = companyMatch[1].trim();

  if (message.length > 8) draft.notes = message.slice(0, 120);
  return draft;
}

function monthRange(date: Date): { startDate: string; endDate: string } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end)
  };
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
