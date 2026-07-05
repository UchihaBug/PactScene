# Security Policy

PactScene is designed as a safe integration layer, but it is not a substitute for your application authorization model.

## Core Security Rules

- Do not store API keys in this repository.
- Do not commit private scene definitions, internal route names, or customer data.
- Treat every AI-produced payload as untrusted input.
- Sanitize payload fields with contracts before they reach a page adapter or API host.
- Re-run business permissions and validation in the real host application.
- Audit the original user message, selected `sceneCode`, contract version, sanitized fields, and rejected fields.

## Reporting Vulnerabilities

Please report security issues privately to the maintainers of your fork or distribution. Do not publish exploit details until a fix is available.

## Publication Safety Scan

This repository includes a local scanner:

```bash
npm run risk:scan
RISK_SCAN_TERMS="private-term-one,private-term-two" npm run risk:scan
```

`RISK_SCAN_TERMS` is intentionally environment-based so private terms do not need to be committed.

