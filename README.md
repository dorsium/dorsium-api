# Dorsium API (`dorsium-api`)

This is the official API gateway for all Dorsium frontend services and apps.  
It acts as a secure proxy layer between user-facing systems and the Dorsium Internal Service.

---

## Tech Stack

- **Framework:** Fastify (high performance)
- **Structure:** Modular, Resource-Oriented
- **Validation:** Zod
- **Docs:** Swagger (auto-generated)

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

## How It Works

1. An HTTP request hits a route under `src/routes`.
2. The route validates input with Zod and forwards the call to a service.
3. Services use `callInternal` to contact the Dorsium Internal Service.
4. Responses are returned in the form `{ ok: true, data }`.

## Getting Started

```bash
git clone https://github.com/dorsium/dorsium-api.git
cd dorsium-api
npm install
cp .env.example .env
npm run dev
```

Swagger UI → [http://localhost:3000/docs](http://localhost:3000/docs)

### Environment Variables

Set these values in `.env` as needed:

- `PORT` - HTTP port to bind (default `3000`)
- `INTERNAL_SERVICE_URL` - URL of the internal Dorsium service

---

## Usage

1. Verify the service is running with the health check:
   ```bash
   curl http://localhost:3000/health
   ```
2. Retrieve an example message:
   ```bash
   curl http://localhost:3000/example?name=John
   ```

Routes are defined in `src/routes` and delegate all logic to matching services.
Services forward requests to the internal API using the `callInternal` helper.

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

- ✅ Health check and example routes implemented
- 🔒 Connects to the Dorsium Internal Service through `callInternal`
- 📘 Swagger auto-doc enabled
