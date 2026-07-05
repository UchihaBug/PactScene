# PactScene

PactScene is a schema-first framework for safely connecting natural-language AI assistants to existing business applications.

The core idea is intentionally narrow:

```text
natural language -> sceneCode -> contract-sanitized payload -> existing page or API host
```

The AI layer does not become the system of record. It only recognizes intent, extracts parameters, and produces controlled cards such as `query_dispatch` or `scene_form`. Existing business screens, permissions, validation, and audit trails remain responsible for real work.

## What This Repository Contains

- `spec/`: JSON Schemas for scenes, contracts, and assistant cards.
- `packages/core`: TypeScript scene registry, payload sanitizer, and deterministic demo planner.
- `packages/react-runtime`: React components for workbench panels, scene cards, and inspectors.
- `examples/demo-web`: A fake-data demo app with neutral order, lead, and incident scenes.
- `gateway-spring`: A Java 17 / Spring Boot reference gateway skeleton with no provider key.
- `scripts/risk-scan.mjs`: A local publication safety scan for secrets and private terms.

## What This Repository Intentionally Excludes

- No real company names.
- No real routes or internal package names.
- No real business schemas.
- No real customer, supplier, account, organization, or employee data.
- No API keys or provider credentials.
- No imported Git history from a private business repository.

## Quick Start

```bash
npm install
npm run build
npm run dev
```

Then open the local URL printed by Vite.

Try prompts such as:

```text
show open orders this month
create a software lead for Acme Labs
find critical incidents
list orders for the north region
```

## Safety Model

PactScene uses four guardrails:

1. **Scene registry**: maps model intent to a known `sceneCode`.
2. **Contract schema**: declares allowed fields and versions.
3. **Payload sanitizer**: removes fields not declared in the contract.
4. **Host adapter**: lets the real page or API decide what the sanitized payload can do.

If a scene has no contract, the reference sanitizer fails closed and rejects the payload.

The AI result is never treated as permission to bypass the underlying application.

## Publish Checklist

Before publishing your fork:

```bash
npm run risk:scan
RISK_SCAN_TERMS="your-private-token,internal-package-prefix" npm run risk:scan
```

Also run a dedicated secret scanner such as GitHub secret scanning, gitleaks, or trufflehog before making the repository public.

## License

Apache-2.0. See [LICENSE](LICENSE).
