import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { Ticket, TicketStore } from "./ticket";
import { setupOtel } from "./tracing";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { Span, trace, Tracer } from "@opentelemetry/api";
import { withTraces } from "../tracedb/withTraces";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../tracedb/schema";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

describe("basic ticket store operations", () => {
  let ticketStore: TicketStore;
  let exporter: InMemorySpanExporter;
  let tracer: Tracer;

  // Some reusable constants for event and user IDs
  const event = "eventId";
  const user1 = "user1Id";
  const user2 = "user2Id";
  const user3 = "user3Id";

  const client = new PGlite();
  const db = drizzle(client, { schema });

  beforeAll(async () => {
    const [, _exporter] = setupOtel("ticket-service");
    exporter = _exporter as InMemorySpanExporter;
    tracer = trace.getTracer("ticket-service");

    await migrate(db, { migrationsFolder: "drizzle/" });
  });

  beforeEach(() => {
    ticketStore = new TicketStore();
  });

  test("tickets can be added to the ticket store", async ({ task }) => {
    const result = await withTraces(db, task, exporter, tracer, () => {
      const ticketId = ticketStore.createTicket(event, user1);

      const ticket = ticketStore.getTicket(ticketId);
      expect(ticket).toMatchObject({
        id: ticketId,
        owner: user1,
        event: event,
        sharedWith: null,
      });
    });

    expect(
      await result.spans.with
        .name("createTicket")
        .have.attribute("owner", user1)
    ).toBe(true);
  });

  test("tickets can be shared between users", () => {
    const ticketId = ticketStore.createTicket(event, user1);

    ticketStore.shareTicket(ticketId, user1, user2);
    let ticket = ticketStore.getTicket(ticketId);
    expect(ticket).toMatchObject({
      id: ticketId,
      owner: user1,
      event: event,
      sharedWith: user2,
    });

    ticketStore.acceptTicket(ticketId, user2);

    ticket = ticketStore.getTicket(ticketId);
    expect(ticket).toMatchObject({
      id: ticketId,
      owner: user2,
      event: event,
      sharedWith: null,
    });
  });

  test("tickets can only be shared by the ticket owner", () => {
    const ticketId = ticketStore.createTicket(event, user1);

    expect(() => {
      ticketStore.shareTicket(ticketId, user2, user3);
    }).toThrowError("a ticket can only be shared by its owner");
  });

  test("tickets that are not shared cannot be accepted by any user", () => {
    const ticketId = ticketStore.createTicket(event, user1);

    expect(() => {
      ticketStore.acceptTicket(ticketId, user2);
    }).toThrowError("ticket has not been shared");
  });

  test("tickets that are shared with one user cannot be accepted by another user", () => {
    const ticketId = ticketStore.createTicket(event, user1);

    ticketStore.shareTicket(ticketId, user1, user2);

    expect(() => {
      ticketStore.acceptTicket(ticketId, user3);
    }).toThrowError(
      "a ticket can only be accepted by the user it is shared with"
    );
  });

  test("sharing a ticket can be cancelled by the owner of the ticket", () => {
    const ticketId = ticketStore.createTicket(event, user1);

    ticketStore.shareTicket(ticketId, user1, user2);

    let ticket = ticketStore.getTicket(ticketId);
    expect(ticket).toMatchObject({
      id: ticketId,
      owner: user1,
      event: event,
      sharedWith: user2,
    });

    ticketStore.cancelShare(ticketId, user1);

    ticket = ticketStore.getTicket(ticketId);
    expect(ticket).toMatchObject({
      id: ticketId,
      owner: user1,
      event: event,
      sharedWith: null,
    });
  });

  test("sharing a ticket cannot be cancelled by a user that is not the owner", () => {
    const ticketId = ticketStore.createTicket(event, user1);

    ticketStore.shareTicket(ticketId, user1, user2);

    expect(() => {
      ticketStore.cancelShare(ticketId, user3);
    }).toThrowError("sharing can only be cancelled by the owner");
  });
});
