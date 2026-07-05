# Scene Contract

A scene contract is the boundary between untrusted AI output and the host application.

```json
{
  "sceneCode": "demo.order.query",
  "version": "1.0.0",
  "sceneType": "query",
  "query": {
    "allowedFields": ["status", "startDate", "endDate"],
    "fields": [
      { "key": "status", "type": "enum", "enum": ["pending", "approved", "paid"] },
      { "key": "startDate", "type": "date" },
      { "key": "endDate", "type": "date" }
    ]
  }
}
```

## Recommended Rules

- Use strings for long IDs to avoid JavaScript precision loss.
- Prefer enums for statuses and categories.
- Keep contract versions explicit.
- Fail closed when a scene has no contract; do not pass the raw AI payload through.
- Return rejected fields for audit, but do not apply them.
- Treat query and create contracts separately.
