# PactScene

Build AI workbench experiences that turn natural language, OCR, or speech into safe, contract-controlled product workflows.

PactScene is a schema-first framework for connecting AI assistants to existing business applications without letting the AI become the system of record.

```text
text / OCR / speech
  -> input envelope
  -> scene graph + rules
  -> sceneCode
  -> contract-sanitized payload
  -> assistant card
  -> existing page, API, GraphQL BFF, or host adapter
```

## Why PactScene

Most AI application demos jump from a prompt directly to a tool call. That is exciting, but risky for real business software.

PactScene adds a protocol layer between AI interpretation and product execution:

- AI can suggest a scene, but contracts decide what data is allowed.
- Rules can extract payloads, but the sanitizer rejects unknown fields.
- Cards can prefill pages, but the host app still owns permissions and writes.
- OCR and speech can become text, but the same scene contracts still apply.

The result is an AI workbench pattern that is easier to audit, test, and embed into existing systems.

## Core Capabilities

- **Scene registry**: declare stable product scenes such as `crm.lead.create` or `demo.order.query`.
- **Scene contracts**: versioned allowlists for query payloads and create drafts.
- **Scene graph planner**: rank candidate scenes and suggest next steps through graph relationships.
- **Rule engine**: deterministic routing and payload extraction from facts.
- **Input adapters**: normalize text, OCR, and speech into a shared `InputEnvelope`.
- **Assistant cards**: emit controlled UI/runtime cards such as `query_dispatch` and `scene_form`.
- **React runtime**: ready-made workbench composer, card preview, query table, and contract inspector.
- **Gateway skeleton**: Spring Boot reference gateway for teams that want a backend boundary.

## Packages

| Package | Purpose |
| --- | --- |
| `@pactscene/core` | Scene types, contracts, sanitizer, cards, scene graph planner, rule engine |
| `@pactscene/input` | Text/OCR/speech input interfaces, mock adapters, input-to-scene planning |
| `@pactscene/react-runtime` | React components for workbench UIs |

## Repository Map

```text
spec/                  JSON schemas for scenes, contracts, cards, and graphs
packages/core/         Core TypeScript protocol and planning utilities
packages/input/        Text, OCR, and speech input normalization
packages/react-runtime React UI runtime components
examples/demo-web/     Browser demo with neutral sample scenes
examples/input-demo/   CLI demo for text, mock OCR, and mock speech
gateway-spring/        Java/Spring gateway skeleton
docs/                  Architecture, contracts, graph/rules, input adapters
```

## Quick Start

```bash
npm install
npm run build
npm run dev
```

Open the local URL printed by Vite.

Try:

```text
show open orders this month
create a software lead for Acme Labs
find critical incidents
list orders for the north region
```

## Input Demo

```bash
npm run demo --workspace @pactscene/input-demo
```

This demonstrates three paths into the same scene graph:

- direct text
- mock OCR
- mock speech transcript

Each path produces a contract-safe assistant card.

## Safety Model

PactScene uses five guardrails:

1. **Scene registry** maps intent to a known `sceneCode`.
2. **Scene graph + rules** rank candidate scenes and extract safe facts.
3. **Contract schema** declares allowed fields and versions.
4. **Payload sanitizer** removes fields not declared in the contract.
5. **Host adapter** lets the real app decide what the sanitized card can do.

If a scene has no contract, the reference sanitizer fails closed and rejects the payload.

The AI result is never treated as permission to bypass the underlying application.

## Where GraphQL Fits

PactScene does not need to own your GraphQL server.

Recommended pattern:

```text
PactScene card
  -> application host adapter
  -> GraphQL query or mutation
  -> product authorization and validation
```

This keeps the framework portable across REST, GraphQL, Spring Boot, serverless, and frontend-only prototypes.

## Example Applications

Complete product examples should live outside the core framework repository.

Recommended split:

- `PactScene`: reusable protocol, runtime, input, graph, and rule primitives.
- `pactscene-crm-example`: full-stack CRM demo with login, API, CRM data, and PactScene scene cards.

## What This Repository Intentionally Excludes

- No real company names.
- No real routes or internal package names.
- No real business schemas.
- No real customer, supplier, account, organization, or employee data.
- No API keys or provider credentials.
- No imported Git history from a private business repository.

## Roadmap Ideas

- Optional OCR and speech provider adapters.
- GraphQL BFF example adapter.
- More host adapters for React Router, REST APIs, and Spring Boot gateways.
- Contract test utilities.
- Visual scene graph inspector.
- More full-stack example applications.

## Publish Checklist

Before publishing your fork:

```bash
npm run risk:scan
RISK_SCAN_TERMS="your-private-token,internal-package-prefix" npm run risk:scan
```

Also run a dedicated secret scanner such as GitHub secret scanning, gitleaks, or trufflehog before making the repository public.

## License

Apache-2.0. See [LICENSE](LICENSE).
