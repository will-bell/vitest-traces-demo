import { trace } from "@opentelemetry/api";
import crypto from "node:crypto";

const tracer = trace.getTracer("ticket-service");

export type Ticket = {
  id: string;
  event: string;
  owner: string;
  sharedWith: string | null;
};

export class TicketStore {
  tickets: Record<string, Ticket>;

  constructor() {
    this.tickets = {};
  }

  // admin methods

  getTicket(ticketId: string): Ticket {
    return this.tickets[ticketId];
  }

  // workflow methods

  createTicket(event: string, owner: string): string {
    return tracer.startActiveSpan("createTicket", (span) => {
      const id = crypto.randomUUID();
      this.tickets[id] = {
        id,
        event,
        owner,
        sharedWith: null,
      };

      span.setAttributes({
        id,
        event,
        owner,
      });

      span.end();
      return id as string;
    });
  }

  shareTicket(id: string, from: string, to: string) {
    return tracer.startActiveSpan("shareTicket", (span) => {
      span.setAttributes({
        id,
        from,
        to,
      });

      const ticket = this.tickets[id];
      if (from !== ticket.owner) {
        const err = new Error("a ticket can only be shared by its owner");
        span.recordException(err);
        throw err;
      }

      this.tickets[id] = {
        id,
        event: ticket.event,
        owner: from,
        sharedWith: to,
      };

      span.end();
    });
  }

  acceptTicket(id: string, to: string) {
    return tracer.startActiveSpan("acceptTicket", (span) => {
      span.setAttributes({
        id,
        to,
      });

      const ticket = this.tickets[id];
      if (!ticket.sharedWith) {
        const err = new Error("ticket has not been shared");
        span.recordException(err);
        throw err;
      }
      if (to !== ticket.sharedWith) {
        const err = new Error(
          "a ticket can only be accepted by the user it is shared with"
        );
        span.recordException(err);
        throw err;
      }

      span.setAttributes({ from: ticket.owner });

      this.tickets[id] = {
        id,
        event: ticket.event,
        owner: to,
        sharedWith: null,
      };

      span.end();
    });
  }

  cancelShare(id: string, from: string) {
    return tracer.startActiveSpan("cancelShare", (span) => {
      span.setAttributes({
        id,
        from,
      });

      const ticket = this.tickets[id];
      if (from !== ticket.owner) {
        const err = new Error("sharing can only be cancelled by the owner");
        span.recordException(err);
        throw err;
      }
      if (!ticket.sharedWith) {
        const err = new Error("ticket has not been shared");
        span.recordException(err);
        throw err;
      }

      span.setAttributes({ to: ticket.sharedWith });

      this.tickets[id] = {
        id,
        event: ticket.event,
        owner: ticket.owner,
        sharedWith: null,
      };

      span.end();
    });
  }
}
