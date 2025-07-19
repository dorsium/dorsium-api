# Dorsium API (`dorsium-api`)

This is the official API gateway for all Dorsium frontend services and apps.  
It acts as a secure proxy layer between user-facing systems and the Dorsium Internal Service.

---

## Tech Stack

- **Framework:** Fastify (high performance)
- **Structure:** Modular, Resource-Oriented
- **Validation:** Zod
- **Docs:** Swagger (auto-generated)
- **Auth:** JWT (via `Authorization: Bearer`)

---

## Project Structure

```
src/
├── routes/        # API endpoints grouped by resource
├── services/      # Logic adapters to the Internal Service
├── plugins/       # Fastify plugins: auth, logger, swagger, i18n
├── utils/         # Error handling, validation utils
├── types/         # Shared interfaces & DTOs
├── config/        # Env var loader & constants
├── server.ts      # Fastify app init
└── index.ts       # App entrypoint
```

---

## Getting Started

```bash
git clone https://github.com/dorsium/dorsium-api.git
cd dorsium-api
npm install
cp .env.example .env
npm dev
```

Swagger UI → [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Authentication

All protected routes require a valid JWT token:
```http
Authorization: Bearer <token>
```

---

## Testing

```bash
npm test
```

---

## Contributing

See [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) for setup, code style, and PR rules.

---

## Status

- ✅ Public routes: `/auth`, `/register`, `/nft`, `/system`
- 🔒 Connects securely to the Dorsium Internal Service
- 📘 Swagger auto-doc enabled
