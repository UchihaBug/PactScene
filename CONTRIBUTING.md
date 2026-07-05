# Contributing

Thanks for helping improve PactScene.

## Principles

- Keep examples generic and fake.
- Prefer schema changes over undocumented conventions.
- Do not add provider-specific secrets, internal endpoints, or private business terminology.
- Keep AI-generated output behind explicit contracts.
- Add tests or examples when changing payload behavior.

## Development

```bash
npm install
npm run generate
npm run build
npm run dev
npm run risk:scan
```

## Pull Request Checklist

- No secrets or private names are present.
- Schema changes are documented.
- Demo data remains fictional.
- New payload fields are represented in contracts.
- The demo app still builds.

