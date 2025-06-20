import { TicketStore } from "./ticket.mjs";
import { setupOtel, setupFastifyOtelPlugin } from "./tracing.mjs";
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

app.listen({ port: 3000 }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
