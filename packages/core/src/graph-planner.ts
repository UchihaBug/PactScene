import type { AiAssistantResponse, AiSceneContract, AiSceneDefinition, Payload, SceneGraphDefinition } from "./types.js";
import { buildQueryDispatchCard, buildSceneFormCard, buildUnknownResponse } from "./cards.js";
import { evaluateSceneRules, factsFromMessage } from "./rule-engine.js";
import { collectGraphSuggestions, rankGraphScenes } from "./scene-graph.js";

export interface GraphPlannerOptions {
  facts?: Payload;
}

export function planGraphMessage(
  message: string,
  scenes: AiSceneDefinition[],
  contracts: AiSceneContract[],
  graph: SceneGraphDefinition,
  options: GraphPlannerOptions = {}
): AiAssistantResponse {
  const facts = factsFromMessage(message, options.facts);
  const evaluation = evaluateSceneRules(graph.rules || [], facts);
  const ranked = rankGraphScenes(evaluation.routeScores, graph);
  const sceneCode = ranked[0]?.sceneCode || chooseSceneByHints(String(facts.message || ""), scenes)?.code;
  const scene = sceneCode ? scenes.find((item) => item.code === sceneCode) : undefined;

  if (!scene) {
    return {
      ...buildUnknownResponse(scenes),
      suggestions: evaluation.suggestions.length ? evaluation.suggestions : collectGraphSuggestions(scenes, graph, undefined, facts)
    };
  }

  if (scene.sceneType === "query") {
    const card = buildQueryDispatchCard(scene, evaluation.payload, contracts, "scene-graph-rule");
    card.metadata.graphVersion = graph.version;
    card.metadata.matchedRules = evaluation.matchedRuleIds;
    return {
      reply: `Matched ${scene.label} through scene graph ${graph.version}.`,
      cards: [card],
      suggestions: mergeSuggestions(evaluation.suggestions, collectGraphSuggestions(scenes, graph, scene.code, facts))
    };
  }

  const card = buildSceneFormCard(scene, evaluation.draft, contracts, "scene-graph-rule");
  card.metadata.graphVersion = graph.version;
  card.metadata.matchedRules = evaluation.matchedRuleIds;
  return {
    reply: `Matched ${scene.label} through scene graph ${graph.version}.`,
    cards: [card],
    suggestions: mergeSuggestions(evaluation.suggestions, collectGraphSuggestions(scenes, graph, scene.code, facts))
  };
}

function chooseSceneByHints(message: string, scenes: AiSceneDefinition[]): AiSceneDefinition | undefined {
  return scenes
    .map((scene) => ({
      scene,
      score: (scene.promptHints || []).reduce((total, hint) => total + (message.includes(hint.toLowerCase()) ? 1 : 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.scene;
}

function mergeSuggestions(first: string[], second: string[], limit = 5): string[] {
  const merged: string[] = [];
  for (const suggestion of [...first, ...second]) {
    if (!merged.includes(suggestion)) merged.push(suggestion);
    if (merged.length >= limit) return merged;
  }
  return merged;
}

