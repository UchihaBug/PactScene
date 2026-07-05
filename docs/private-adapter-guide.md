# Private Adapter Guide

Use this project as a public framework and keep private integrations in a separate repository.

## Suggested Split

Public repository:

- Protocol schemas.
- Generic runtime.
- Fake demo scenes.
- Reference gateway skeleton.

Private repository:

- Real scene definitions.
- Real host adapters.
- Real route mappings.
- Permission integration.
- Provider credentials.

## Safe Integration Pattern

1. Import the public runtime package.
2. Load private scenes from your private repository or configuration service.
3. Run every AI payload through the public sanitizer plus your own authorization checks.
4. Pass only sanitized payloads to existing pages or APIs.
5. Audit both accepted and rejected fields.

