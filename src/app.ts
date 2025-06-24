import { TicketStore } from "./ticket";
import { setupOtel, setupFastifyOtelPlugin } from "./tracing";
const [provider, _] = setupOtel("ticket-service");
const fastifyInstrumentation = setupFastifyOtelPlugin(
  provider,
  "ticket-service"
);

import fastify from "fastify";
const app = fastify();
await app.register(fastifyInstrumentation.plugin());

const ticketStore = new TicketStore();

app.post("/ticket", (req, res) => {});
app.post("/ticket/transfer", (req, res) => {});

export default app;
