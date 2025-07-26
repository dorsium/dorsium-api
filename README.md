# Dorsium API (`dorsium-api`)

This is the official API gateway for all Dorsium frontend services and apps.  
It acts as a secure proxy layer between user-facing systems and the Dorsium Internal Service.

## Requirements
- Node.js 21 or later

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

1. `buildServer()` loads environment variables and registers Swagger and JWT plugins.
2. Requests enter the router under `src/routes` where Zod parses the input.
3. Route handlers delegate all logic to functions in `src/services`.
4. Services communicate with the Dorsium Internal Service through `callInternal`.
5. Each handler responds with `{ ok: true, data }` on success.

## Getting Started

```bash
git clone https://github.com/dorsium/dorsium-api.git
cd dorsium-api
npm install
cp .env.example .env
npm run dev
```

Swagger UI → [http://localhost:3000/docs](http://localhost:3000/docs)

See [`docs/database.md`](./docs/database.md) for database initialization.

### Environment Variables

Set these values in `.env` as needed:

- `PORT` - HTTP port to bind (default `3000`)
- `INTERNAL_SERVICE_URL` - URL of the internal Dorsium service
- `JWT_SECRET` - secret used for signing JWT tokens

---

## Using the API

1. Start the server with `npm run dev` in development or `npm start` after building.
2. Visit `http://localhost:3000/docs` for interactive Swagger documentation.
3. Check the service status:
   ```bash
   curl http://localhost:3000/health
   ```
4. Call the example endpoint:
   ```bash
   curl http://localhost:3000/example?name=John
   ```
5. Create a user:
   ```bash
   curl -X POST http://localhost:3000/users \
     -H 'Content-Type: application/json' \
     -d '{"name":"John","username":"johnny"}'
   ```
6. Fetch a user:
   ```bash
   curl http://localhost:3000/users/1
   ```
Routes are organized in `src/routes` and forward logic to `src/services`, which talk to the internal API via `callInternal`.

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
- ✅ User creation and fetch routes available
- 🔒 Connects to the Dorsium Internal Service through `callInternal`
- 📘 Swagger auto-doc enabled
