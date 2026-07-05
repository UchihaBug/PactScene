export type SceneType = "query" | "create";

export type FieldType = "string" | "number" | "money" | "date" | "date-range" | "enum" | "id" | "boolean";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type Payload = Record<string, JsonValue | undefined>;

export type RuleOperator =
  | "includes"
  | "regex"
  | "equals"
  | "notEquals"
  | "in"
  | "gte"
  | "lte"
  | "exists";

export interface RuleCondition {
  fact: string;
  operator: RuleOperator;
  value?: JsonValue;
}

export interface RuleWhen {
  all?: RuleCondition[];
  any?: RuleCondition[];
  not?: RuleCondition[];
}

export type RuleActionType = "route" | "setPayload" | "setDraft" | "suggest";

export interface RuleAction {
  type: RuleActionType;
  sceneCode?: string;
  field?: string;
  value?: JsonValue;
  score?: number;
  suggestion?: string;
}

export interface SceneRule {
  id: string;
  description?: string;
  when: RuleWhen;
  then: RuleAction[];
}

export interface RuleEvaluation {
  matchedRuleIds: string[];
  routeScores: Record<string, number>;
  payload: Payload;
  draft: Payload;
  suggestions: string[];
}

export type SceneGraphRelation = "related" | "next" | "fallback";

export interface SceneGraphNode {
  sceneCode: string;
  weight?: number;
  tags?: string[];
}

export interface SceneGraphEdge {
  from: string;
  to: string;
  relation: SceneGraphRelation;
  weight?: number;
  guard?: RuleWhen;
}

export interface SceneGraphDefinition {
  version: string;
  nodes: SceneGraphNode[];
  edges?: SceneGraphEdge[];
  rules?: SceneRule[];
}

export interface AiFieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  enum?: string[];
  aliases?: string[];
}

export interface AiSceneDefinition {
  code: string;
  intent: string;
  sceneType: SceneType;
  label: string;
  promptHints?: string[];
  suggestions?: string[];
  query?: {
    filterFields?: AiFieldDefinition[];
    fixedParams?: Payload;
  };
  form?: {
    draftFields?: AiFieldDefinition[];
  };
  host?: {
    hostKey: string;
    mode?: "embed_query" | "route_query" | "embed_form" | "route_form";
    continueRoute?: string;
  };
}

export interface AiFieldRule {
  key: string;
  type: FieldType;
  enum?: string[];
  min?: number;
  max?: number;
  format?: string;
}

export interface AiPayloadContract {
  allowedFields: string[];
  requiredFields?: string[];
  fields: AiFieldRule[];
  dangerousAction?: boolean;
}

export interface AiSceneContract {
  sceneCode: string;
  version: string;
  sceneType: SceneType;
  query?: AiPayloadContract;
  create?: AiPayloadContract;
}

export interface AiCardMetadata {
  sceneType: SceneType;
  mode: string;
  intent: string;
  parser: string;
  contractMode: "scene_contract";
  contractVersion: string;
  [key: string]: JsonValue | undefined;
}

export interface AiQueryDispatchCard {
  type: "query_dispatch";
  sceneCode: string;
  prefill: Payload;
  rejectedFields?: string[];
  metadata: AiCardMetadata;
}

export interface AiSceneFormCard {
  type: "scene_form";
  sceneCode: string;
  draft: Payload;
  missingFields: string[];
  rejectedFields?: string[];
  metadata: AiCardMetadata;
}

export type AiWorkbenchCard = AiQueryDispatchCard | AiSceneFormCard;

export interface AiAssistantResponse {
  reply: string;
  cards: AiWorkbenchCard[];
  suggestions: string[];
}

export interface SanitizedPayload {
  payload: Payload;
  rejectedFields: string[];
  missingFields: string[];
  contractVersion: string;
}
