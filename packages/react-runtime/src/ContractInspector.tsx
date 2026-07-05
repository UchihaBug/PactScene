import { ShieldCheck } from "lucide-react";
import type { AiSceneContract, AiWorkbenchCard } from "@pactscene/core";

interface ContractInspectorProps {
  card?: AiWorkbenchCard;
  contract?: AiSceneContract;
}

export function ContractInspector({ card, contract }: ContractInspectorProps) {
  const payloadContract = contract?.sceneType === "query" ? contract.query : contract?.create;
  const allowedFields = payloadContract?.allowedFields || [];
  const rejectedFields = card?.rejectedFields || [];

  return (
    <section className="asw-inspector" aria-label="Contract inspector">
      <div className="asw-section-title">
        <span>Contract inspector</span>
        <strong>{contract?.version || "none"}</strong>
      </div>

      <div className="asw-inspector-banner">
        <ShieldCheck size={18} aria-hidden="true" />
        <span>Only allowed fields may reach a host adapter.</span>
      </div>

      <div className="asw-inspector-block">
        <h3>Allowed fields</h3>
        <div className="asw-field-list">
          {allowedFields.length ? allowedFields.map((field) => <code key={field}>{field}</code>) : <span className="asw-muted">No contract selected</span>}
        </div>
      </div>

      <div className="asw-inspector-block">
        <h3>Rejected fields</h3>
        <div className="asw-field-list">
          {rejectedFields.length ? rejectedFields.map((field) => <code key={field}>{field}</code>) : <span className="asw-muted">None</span>}
        </div>
      </div>

      <div className="asw-inspector-block">
        <h3>Raw card</h3>
        <pre>{card ? JSON.stringify(card, null, 2) : "Run a prompt to inspect a card."}</pre>
      </div>
    </section>
  );
}

