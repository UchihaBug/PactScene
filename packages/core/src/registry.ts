import type { AiSceneContract, AiSceneDefinition } from "./types.js";

export function indexScenes(scenes: AiSceneDefinition[]): Map<string, AiSceneDefinition> {
  return new Map(scenes.map((scene) => [scene.code, scene]));
}

export function indexContracts(contracts: AiSceneContract[]): Map<string, AiSceneContract> {
  return new Map(contracts.map((contract) => [contract.sceneCode, contract]));
}

export function findSceneByIntent(scenes: AiSceneDefinition[], intent: string): AiSceneDefinition | undefined {
  return scenes.find((scene) => scene.intent === intent);
}

export function collectSuggestions(scenes: AiSceneDefinition[], limit = 5): string[] {
  const suggestions: string[] = [];
  for (const scene of scenes) {
    for (const suggestion of scene.suggestions || []) {
      if (!suggestions.includes(suggestion)) suggestions.push(suggestion);
      if (suggestions.length >= limit) return suggestions;
    }
  }
  return suggestions;
}
