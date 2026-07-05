# Spring Gateway Reference

This is a Java 17 / Spring Boot reference skeleton for an PactScene gateway.

It intentionally contains:

- No API keys.
- No provider-specific model configuration.
- No real business scene definitions.
- No database access.

The production shape should be:

```text
POST /api/ai/workbench/chat
  -> provider adapter or deterministic fallback
  -> scene registry
  -> contract sanitizer
  -> assistant card response
```

Keep real provider credentials and private scene definitions outside this public repository.

