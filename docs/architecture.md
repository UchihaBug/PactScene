# Architecture

PactScene separates AI planning from business execution.

```text
User message
  -> planner
  -> scene graph and rule engine
  -> scene registry
  -> contract sanitizer
  -> assistant card
  -> frontend runtime
  -> host adapter
  -> existing business page or API
```

## Modules

### Scene Registry

The registry declares known scenes. A scene is identified by a stable `sceneCode`, such as `demo.order.query`.

### Scene Graph

The graph ranks candidate scenes and describes relationships between scenes. It is useful when one request can match multiple scenes or when a product wants contextual next-step suggestions.

### Rule Engine

The rule engine evaluates deterministic conditions over facts such as the normalized user message, user role, route, tenant, or feature flags. Rules can route to a scene, set query payload fields, set draft form fields, or add suggestions.

### Contract

A contract declares what a scene may accept. Fields outside the contract are rejected before reaching a host adapter.

### Card

A card is the protocol between AI planning and UI runtime. The first version supports:

- `query_dispatch`: show or execute a query host.
- `scene_form`: render or prefill a creation form.

### Host Adapter

The adapter is application-specific. It receives a sanitized payload and passes it to an existing page or API that still enforces permissions and validation.

## Non-goals

- Direct database querying by the AI layer.
- Hidden writes to production systems.
- Replacing an application's authorization model.
- Committing private business scene definitions to this open-source repository.
