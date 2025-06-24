# Vitest Traces Demo

This project demonstrates using Fastify with [OpenTelemetry](https://opentelemetry.io/) instrumentation and tests written with [Vitest](https://vitest.dev/). It exposes a minimal ticket service and shows how spans can be captured during unit tests.

## Requirements

- Node.js >= 18
- npm

## Installation

```bash
npm install
```

## Running the test suite

Run all tests:

```bash
npx vitest run
```

or using the npm script:

```bash
npm test
```

## Development server

Start the Fastify server in development mode:

```bash
npm run server:dev
```

The server listens on port `3000` by default.

## Project structure

- `src/` – application source files
  - `app.ts` sets up the Fastify instance and OpenTelemetry integration
  - `ticket.ts` implements an in‑memory ticket store
  - `tracing.ts` configures the OpenTelemetry provider
  - `ticket.test.ts` contains unit tests for the ticket store
- `test/` – example integration tests (currently disabled)

## License

MIT
