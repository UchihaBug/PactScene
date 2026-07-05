import type { AiPayloadContract, AiSceneContract, FieldType, JsonValue, Payload, SanitizedPayload } from "./types.js";

export function sanitizePayload(
  sceneCode: string,
  payload: Payload,
  contracts: AiSceneContract[],
  mode: "query" | "create"
): SanitizedPayload {
  const contract = contracts.find((item) => item.sceneCode === sceneCode);
  const payloadContract = mode === "query" ? contract?.query : contract?.create;

  if (!contract || !payloadContract) {
    return {
      payload: {},
      rejectedFields: Object.keys(payload).filter((key) => payload[key] !== undefined),
      missingFields: [],
      contractVersion: "missing"
    };
  }

  return sanitizeWithContract(payload, payloadContract, contract.version);
}

export function sanitizeWithContract(
  payload: Payload,
  contract: AiPayloadContract,
  contractVersion: string
): SanitizedPayload {
  const allowed = new Set(contract.allowedFields);
  const ruleByKey = new Map(contract.fields.map((field) => [field.key, field]));
  const result: Payload = {};
  const rejectedFields: string[] = [];

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    if (!allowed.has(key)) {
      rejectedFields.push(key);
      continue;
    }
    const rule = ruleByKey.get(key);
    if (rule && !isValueCompatible(value, rule.type, rule.enum)) {
      rejectedFields.push(key);
      continue;
    }
    if (rule?.type === "number" || rule?.type === "money") {
      const numeric = Number(value);
      if (Number.isFinite(rule.min) && numeric < Number(rule.min)) {
        rejectedFields.push(key);
        continue;
      }
      if (Number.isFinite(rule.max) && numeric > Number(rule.max)) {
        rejectedFields.push(key);
        continue;
      }
    }
    result[key] = value;
  }

  const missingFields = (contract.requiredFields || []).filter((field) => {
    const value = result[field];
    return value === undefined || value === null || value === "";
  });

  return {
    payload: result,
    rejectedFields,
    missingFields,
    contractVersion
  };
}

function isValueCompatible(value: JsonValue, type: FieldType, enumValues?: string[]): boolean {
  if (value === null) return false;
  switch (type) {
    case "string":
    case "id":
      return typeof value === "string";
    case "number":
    case "money":
      return typeof value === "number" || (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)));
    case "boolean":
      return typeof value === "boolean";
    case "date":
      return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
    case "date-range":
      return Array.isArray(value) && value.length === 2 && value.every((item) => typeof item === "string");
    case "enum":
      return typeof value === "string" && (!enumValues?.length || enumValues.includes(value));
    default:
      return false;
  }
}
