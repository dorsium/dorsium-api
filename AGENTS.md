# AGENTS.md – Contribution Policy

This document defines strict contribution guidelines when reviewing or optimizing the `dorsium-api` project.

## Architecture

- Follow **Modular, Resource-Oriented structure**.
- No business logic in route files — only HTTP mapping.
- All logic must flow through `services/`, which call the Dorsium Internal Service.
- Respect the onion-layer principle:
  - No direct DB access.
  - No shortcutting `route → utility → internalService`. Always go through `service`.

## Testing & Validation

- All logic must be unit-testable.
- Input validation must use **Zod** schemas.
- All protected routes must enforce JWT verification via middleware (`app.authenticate`).
- Route files must be structured and minimal — no inline conditionals or mixed logic.

## API Design

- Prefer REST-style paths: `/register/start`, `/nft/mint`, etc.
- All responses must be consistent:  
  - `{ ok: true, data }`  
  - `{ ok: false, error, status }`
- Use proper HTTP codes (200, 400, 401, 403, 500, etc.)

## Code Consistency

- Use named imports, not `require()` or default imports.
- Avoid `any`. Always type response and request bodies using `types/`.
- All logic must use the `callInternal()` wrapper for external service communication.
- Place shared logic (parsers, validators, transformers) inside `utils/`.

## Folder Guidelines

- `routes/`: HTTP endpoints (entrypoints only)
- `services/`: Internal logic, forwarding, and auth-scoped execution
- `plugins/`: Fastify plugins (auth, logging, swagger, rate-limiting, etc.)
- `utils/`: Shared utilities
- `types/`: DTOs and interfaces
- `config/`: Static config values and env

## Tasks

Every structural change proposed must:

- Include a commit message in English
- Be consistent across all related modules
- Maintain full TypeScript and ESLint compliance
- Not break Swagger auto-generation

## Output Format

Only necessary changes. No extra formatting, console logs, or unrelated refactors unless explicitly requested.

---

This file is part of the Dorsium API system. Internal architecture decisions must be discussed with core maintainers via GitHub Issues or direct assignment.
