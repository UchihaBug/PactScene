# Scene Graph And Rule Engine

PactScene includes a small deterministic graph planner for routing natural-language requests into safe scene cards.

The flow is:

```text
message -> facts -> rules -> scene graph ranking -> contract sanitizer -> card
```

## What Belongs In The Core Repository

Keep reusable primitives here:

- `SceneGraphDefinition`
- `SceneRule`
- `RuleCondition`
- `planGraphMessage`
- graph and rule JSON schemas
- neutral examples under `spec/examples`

## What Belongs In Separate Example Repositories

Keep complete product examples outside the core repository:

- CRM, ERP, analytics, and support applications
- GraphQL resolvers or BFF servers
- database schemas and seed data
- application-specific permission models
- adapters for real product pages

For example, a CRM app can expose a GraphQL query such as `crmBootstrap`, but PactScene should only emit a sanitized scene card. The CRM app decides how that card maps to GraphQL, REST, routing, or local UI state.

## Rule Example

```json
{
  "id": "route-order-query",
  "when": {
    "any": [
      { "fact": "message", "operator": "includes", "value": "order" },
      { "fact": "message", "operator": "includes", "value": "subscription" }
    ]
  },
  "then": [
    { "type": "route", "sceneCode": "demo.order.query", "score": 6 },
    { "type": "setPayload", "field": "status", "value": "open" }
  ]
}
```

## GraphQL Integration Pattern

Use GraphQL at the application boundary, not inside the generic planner:

```text
PactScene card
  -> app host adapter
  -> GraphQL query or mutation
  -> product authorization and validation
```

This keeps the framework portable. A REST app, GraphQL app, or Spring Boot app can all consume the same scene card protocol.
