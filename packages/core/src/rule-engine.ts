import type { JsonValue, Payload, RuleAction, RuleCondition, RuleEvaluation, RuleWhen, SceneRule } from "./types.js";

export function factsFromMessage(message: string, extraFacts: Payload = {}): Payload {
  const normalized = message.trim().toLowerCase();
  const tokens = normalized.split(/[^a-z0-9.-]+/).filter(Boolean);
  return {
    message: normalized,
    tokenCount: tokens.length,
    ...extraFacts
  };
}

export function evaluateSceneRules(rules: SceneRule[] = [], facts: Payload): RuleEvaluation {
  const evaluation: RuleEvaluation = {
    matchedRuleIds: [],
    routeScores: {},
    payload: {},
    draft: {},
    suggestions: []
  };

  for (const rule of rules) {
    if (!matchesWhen(rule.when, facts)) continue;
    evaluation.matchedRuleIds.push(rule.id);
    applyActions(rule.then, evaluation);
  }

  return evaluation;
}

export function matchesWhen(when: RuleWhen, facts: Payload): boolean {
  const all = when.all || [];
  const any = when.any || [];
  const not = when.not || [];

  const allMatched = all.every((condition) => matchesCondition(condition, facts));
  const anyMatched = any.length === 0 || any.some((condition) => matchesCondition(condition, facts));
  const notMatched = not.every((condition) => !matchesCondition(condition, facts));

  return allMatched && anyMatched && notMatched;
}

export function matchesCondition(condition: RuleCondition, facts: Payload): boolean {
  const actual = facts[condition.fact];
  const expected = condition.value;

  switch (condition.operator) {
    case "exists":
      return actual !== undefined && actual !== null && actual !== "";
    case "includes":
      return includesValue(actual, expected);
    case "regex":
      return typeof actual === "string" && typeof expected === "string" && new RegExp(expected, "i").test(actual);
    case "equals":
      return actual === expected;
    case "notEquals":
      return actual !== expected;
    case "in":
      return Array.isArray(expected) && expected.includes(actual as JsonValue);
    case "gte":
      return Number(actual) >= Number(expected);
    case "lte":
      return Number(actual) <= Number(expected);
    default:
      return false;
  }
}

function applyActions(actions: RuleAction[], evaluation: RuleEvaluation) {
  for (const action of actions) {
    if (action.type === "route" && action.sceneCode) {
      evaluation.routeScores[action.sceneCode] = (evaluation.routeScores[action.sceneCode] || 0) + (action.score || 1);
    }
    if (action.type === "setPayload" && action.field) {
      evaluation.payload[action.field] = action.value;
    }
    if (action.type === "setDraft" && action.field) {
      evaluation.draft[action.field] = action.value;
    }
    if (action.type === "suggest" && action.suggestion && !evaluation.suggestions.includes(action.suggestion)) {
      evaluation.suggestions.push(action.suggestion);
    }
  }
}

function includesValue(actual: JsonValue | undefined, expected: JsonValue | undefined): boolean {
  if (actual === undefined || expected === undefined || expected === null) return false;
  if (typeof actual === "string") return actual.includes(String(expected).toLowerCase());
  if (Array.isArray(actual)) return actual.includes(expected);
  return false;
}

