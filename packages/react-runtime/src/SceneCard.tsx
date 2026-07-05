import { CheckCircle2, FileInput, Search } from "lucide-react";
import type { AiWorkbenchCard } from "@pactscene/core";

interface SceneCardProps {
  card?: AiWorkbenchCard;
}

export function SceneCard({ card }: SceneCardProps) {
  if (!card) {
    return (
      <section className="asw-scene-card asw-empty-state">
        <Search size={24} aria-hidden="true" />
        <h2>No scene selected</h2>
        <p>Run a prompt to produce a contract-sanitized card.</p>
      </section>
    );
  }

  const payload = card.type === "query_dispatch" ? card.prefill : card.draft;

  return (
    <section className="asw-scene-card" aria-label="Scene card">
      <div className="asw-card-header">
        <div className="asw-card-icon">{card.type === "query_dispatch" ? <Search size={18} /> : <FileInput size={18} />}</div>
        <div>
          <h2>{card.sceneCode}</h2>
          <p>{card.type}</p>
        </div>
      </div>

      <dl className="asw-metadata-grid">
        <div>
          <dt>sceneCode</dt>
          <dd>{card.sceneCode}</dd>
        </div>
        <div>
          <dt>contractVersion</dt>
          <dd>{card.metadata.contractVersion}</dd>
        </div>
        <div>
          <dt>parser</dt>
          <dd>{card.metadata.parser}</dd>
        </div>
        <div>
          <dt>mode</dt>
          <dd>{card.metadata.mode}</dd>
        </div>
      </dl>

      <div className="asw-payload-list">
        <div className="asw-section-title">
          <span>{card.type === "query_dispatch" ? "Sanitized prefill" : "Sanitized draft"}</span>
          <strong>{Object.keys(payload).length} fields</strong>
        </div>
        {Object.keys(payload).length ? (
          Object.entries(payload).map(([key, value]) => (
            <div className="asw-payload-row" key={key}>
              <span>{key}</span>
              <code>{String(value)}</code>
            </div>
          ))
        ) : (
          <p className="asw-muted">No payload fields were extracted.</p>
        )}
      </div>

      {!!card.rejectedFields?.length && (
        <div className="asw-rejected">
          <strong>Rejected fields</strong>
          <span>{card.rejectedFields.join(", ")}</span>
        </div>
      )}

      {card.type === "scene_form" && (
        <div className="asw-form-status">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{card.missingFields.length ? `${card.missingFields.length} required fields still missing` : "Draft has all required fields"}</span>
        </div>
      )}
    </section>
  );
}

