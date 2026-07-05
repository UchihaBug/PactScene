import type { AiSceneContract, AiSceneDefinition, AiQueryDispatchCard, Payload, SceneGraphDefinition } from "@pactscene/core";

import orderScene from "../../../../spec/examples/scenes/demo.order.query.json";
import leadScene from "../../../../spec/examples/scenes/demo.lead.create.json";
import incidentScene from "../../../../spec/examples/scenes/demo.incident.query.json";
import orderContract from "../../../../spec/examples/contracts/demo.order.query.contract.json";
import leadContract from "../../../../spec/examples/contracts/demo.lead.create.contract.json";
import incidentContract from "../../../../spec/examples/contracts/demo.incident.query.contract.json";
import demoSceneGraph from "../../../../spec/examples/graphs/demo-scene-graph.json";

export const demoScenes = [orderScene, leadScene, incidentScene] as AiSceneDefinition[];
export const demoContracts = [orderContract, leadContract, incidentContract] as AiSceneContract[];
export const demoGraph = demoSceneGraph as SceneGraphDefinition;

export interface DemoOrderRow {
  id: string;
  subject: string;
  status: "open" | "processing" | "shipped";
  amount: number;
  orderDate: string;
  region: "north" | "south" | "west";
  owner: string;
}

export interface DemoIncidentRow {
  id: string;
  title: string;
  severity: "low" | "normal" | "critical";
  status: "open" | "waiting" | "closed";
  owner: string;
}

export type DemoResultRow = DemoOrderRow | DemoIncidentRow;

const orders: DemoOrderRow[] = [
  { id: "ORD-1001", subject: "Annual analytics subscription", status: "open", amount: 8200, orderDate: "2026-07-12", region: "north", owner: "Mina" },
  { id: "ORD-1002", subject: "Design platform renewal", status: "processing", amount: 3100, orderDate: "2026-07-18", region: "south", owner: "Noah" },
  { id: "ORD-1003", subject: "Enterprise support package", status: "shipped", amount: 12600, orderDate: "2026-06-28", region: "west", owner: "Avery" },
  { id: "ORD-1004", subject: "Data warehouse expansion", status: "open", amount: 4600, orderDate: "2026-07-25", region: "north", owner: "Lena" }
];

const incidents: DemoIncidentRow[] = [
  { id: "INC-2101", title: "Webhook delivery failed", severity: "critical", status: "open", owner: "me" },
  { id: "INC-2102", title: "Search index delayed", severity: "normal", status: "waiting", owner: "Rae" },
  { id: "INC-2103", title: "Export worker recovered", severity: "low", status: "closed", owner: "me" },
  { id: "INC-2104", title: "API error spike", severity: "critical", status: "open", owner: "Noah" }
];

export function runDemoQuery(card?: AiQueryDispatchCard): DemoResultRow[] {
  if (!card) return [];
  if (card.sceneCode === "demo.order.query") return filterOrders(card.prefill);
  if (card.sceneCode === "demo.incident.query") return filterIncidents(card.prefill);
  return [];
}

function filterOrders(payload: Payload): DemoOrderRow[] {
  return orders.filter((row) => {
    if (payload.status && row.status !== payload.status) return false;
    if (typeof payload.minAmount === "number" && row.amount < payload.minAmount) return false;
    if (typeof payload.startDate === "string" && row.orderDate < payload.startDate) return false;
    if (typeof payload.endDate === "string" && row.orderDate > payload.endDate) return false;
    if (payload.region && row.region !== payload.region) return false;
    return true;
  });
}

function filterIncidents(payload: Payload): DemoIncidentRow[] {
  return incidents.filter((row) => {
    if (payload.severity && row.severity !== payload.severity) return false;
    if (payload.status && row.status !== payload.status) return false;
    if (payload.owner && row.owner !== payload.owner) return false;
    return true;
  });
}

export function isOrderRow(row: DemoResultRow): row is DemoOrderRow {
  return "amount" in row;
}
