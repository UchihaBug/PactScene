import type { AiSceneDefinition, Payload, SceneGraphDefinition, SceneGraphEdge, SceneGraphNode } from "./types.js";
import { matchesWhen } from "./rule-engine.js";

export function indexSceneGraph(graph: SceneGraphDefinition): Map<string, SceneGraphNode> {
  return new Map(graph.nodes.map((node) => [node.sceneCode, node]));
}

export function rankGraphScenes(routeScores: Record<string, number>, graph: SceneGraphDefinition): Array<{ sceneCode: string; score: number }> {
  const nodeByCode = indexSceneGraph(graph);
  return Object.entries(routeScores)
    .map(([sceneCode, score]) => ({
      sceneCode,
      score: score + (nodeByCode.get(sceneCode)?.weight || 0)
    }))
    .sort((a, b) => b.score - a.score);
}

export function collectGraphSuggestions(
  scenes: AiSceneDefinition[],
  graph: SceneGraphDefinition,
  activeSceneCode?: string,
  facts: Payload = {},
  limit = 5
): string[] {
  const sceneByCode = new Map(scenes.map((scene) => [scene.code, scene]));
  const candidates = activeSceneCode ? reachableSceneCodes(graph, activeSceneCode, facts) : graph.nodes.map((node) => node.sceneCode);
  const suggestions: string[] = [];

  for (const sceneCode of candidates) {
    const scene = sceneByCode.get(sceneCode);
    for (const suggestion of scene?.suggestions || []) {
      if (!suggestions.includes(suggestion)) suggestions.push(suggestion);
      if (suggestions.length >= limit) return suggestions;
    }
  }

  for (const scene of scenes) {
    for (const suggestion of scene.suggestions || []) {
      if (!suggestions.includes(suggestion)) suggestions.push(suggestion);
      if (suggestions.length >= limit) return suggestions;
    }
  }

  return suggestions;
}

export function reachableSceneCodes(graph: SceneGraphDefinition, from: string, facts: Payload = {}): string[] {
  const outgoing = (graph.edges || [])
    .filter((edge) => edge.from === from && edgeMatches(edge, facts))
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .map((edge) => edge.to);
  return [from, ...outgoing];
}

function edgeMatches(edge: SceneGraphEdge, facts: Payload): boolean {
  return edge.guard ? matchesWhen(edge.guard, facts) : true;
}

