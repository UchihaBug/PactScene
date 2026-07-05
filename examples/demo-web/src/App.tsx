import { useMemo, useState } from "react";
import { Boxes, FileJson2, History, LayoutDashboard, ShieldCheck } from "lucide-react";
import { collectSuggestions, planDemoMessage, type AiAssistantResponse, type AiQueryDispatchCard } from "@pactscene/core";
import { ContractInspector, QueryPreviewTable, SceneCard, WorkbenchComposer, type QueryPreviewColumn } from "@pactscene/react-runtime";
import sceneIndex from "./generated/scene-index.json";
import { demoContracts, demoScenes, isOrderRow, runDemoQuery, type DemoResultRow } from "./data/demoLibrary";
import "./styles.css";

const initialResponse: AiAssistantResponse = {
  reply: "Ready.",
  cards: [],
  suggestions: collectSuggestions(demoScenes)
};

const navItems = [
  { label: "Workbench", icon: LayoutDashboard },
  { label: "Scenes", icon: Boxes },
  { label: "Contracts", icon: ShieldCheck },
  { label: "Audit", icon: History }
];

const columns: QueryPreviewColumn<DemoResultRow>[] = [
  { key: "id", label: "ID" },
  {
    key: "subject",
    label: "Subject",
    render: (row) => (isOrderRow(row) ? row.subject : row.title)
  },
  {
    key: "status",
    label: "Status"
  },
  {
    key: "owner",
    label: "Owner"
  },
  {
    key: "amount",
    label: "Value",
    render: (row) => (isOrderRow(row) ? `$${row.amount.toLocaleString()}` : row.severity)
  }
];

export function App() {
  const [prompt, setPrompt] = useState("show open orders this month");
  const [response, setResponse] = useState<AiAssistantResponse>(initialResponse);

  const activeCard = response.cards[0];
  const activeContract = demoContracts.find((contract) => contract.sceneCode === activeCard?.sceneCode);
  const queryCard = activeCard?.type === "query_dispatch" ? (activeCard as AiQueryDispatchCard) : undefined;
  const rows = useMemo(() => runDemoQuery(queryCard), [queryCard]);

  const submitPrompt = () => {
    setResponse(planDemoMessage(prompt, demoScenes, demoContracts, { today: new Date("2026-07-05") }));
  };

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Project navigation">
        <div className="brand">
          <FileJson2 size={22} aria-hidden="true" />
          <span>PactScene</span>
        </div>
        <nav>
          {navItems.map((item) => (
            <button key={item.label} className={item.label === "Workbench" ? "active" : ""} type="button">
              <item.icon size={17} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>Spec scenes</span>
          <strong>{sceneIndex.scenes.length}</strong>
        </div>
      </aside>

      <section className="workspace" aria-label="AI scene workbench">
        <header className="topbar">
          <div>
            <h1>PactScene</h1>
            <p>Schema-first AI dispatch for existing business screens.</p>
          </div>
          <div className="status-strip">
            <span>Apache-2.0</span>
            <span>No secrets</span>
            <span>Fake data</span>
          </div>
        </header>

        <div className="work-grid">
          <WorkbenchComposer value={prompt} onValueChange={setPrompt} onSubmit={submitPrompt} suggestions={response.suggestions} />
          <SceneCard card={activeCard} />
          <ContractInspector card={activeCard} contract={activeContract} />
        </div>

        <div className="reply-line" role="status">
          {response.reply}
        </div>

        {activeCard?.type === "scene_form" ? (
          <section className="form-host" aria-label="Scene form preview">
            <div className="asw-section-title">
              <span>Form host preview</span>
              <strong>{activeCard.missingFields.length ? "needs input" : "ready"}</strong>
            </div>
            <div className="form-grid">
              {["company", "industry", "priority", "notes"].map((field) => (
                <label key={field}>
                  <span>{field}</span>
                  <input value={String(activeCard.draft[field] ?? "")} readOnly />
                </label>
              ))}
            </div>
          </section>
        ) : (
          <QueryPreviewTable title="Preview result" rows={rows} columns={columns} />
        )}
      </section>
    </main>
  );
}
