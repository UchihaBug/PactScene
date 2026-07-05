export type SceneType = "query" | "create";

export type FieldType = "string" | "number" | "money" | "date" | "date-range" | "enum" | "id" | "boolean";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type Payload = Record<string, JsonValue | undefined>;

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

