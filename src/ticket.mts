export type Ticket = {
  id: string;
  event: string;
  owner: string;
  sharedWith: string;
};

const tickets: Record<string, Ticket> = {};

export class TicketStore {
  tickets: Record<string, Ticket>;

  constructor() {
    this.tickets = {};
  }

  // admin methods

  getTicket(ticketId: string): Ticket {
    return tickets[ticketId];
  }

  // workflow methods

  createTicket(event: string, owner: string): string {
    const id = crypto.randomUUID();
    tickets[id] = {
      id,
      event,
      owner,
      sharedWith: null,
    };
    return id;
  }

  shareTicket(id: string, from: string, to: string) {
    const ticket = tickets[id];
    if (from !== ticket.owner) {
      throw new Error("a ticket can only be shared by its owner");
    }

    tickets[id] = {
      id,
      event: ticket.event,
      owner: from,
      sharedWith: to,
    };
  }

  acceptTicket(id: string, to: string) {
    const ticket = tickets[id];
    if (!ticket.sharedWith) {
      throw new Error("ticket has not been shared");
    }
    if (to !== ticket.sharedWith) {
      throw new Error(
        "a ticket can only be accepted by the user it is shared with"
      );
    }

    tickets[id] = {
      id,
      event: ticket.event,
      owner: to,
      sharedWith: null,
    };
  }

  cancelShare(id: string, user: string) {
    const ticket = tickets[id];
    if (user !== ticket.owner) {
      throw new Error("sharing can only be cancelled by the owner");
    }
    if (!ticket.sharedWith) {
      throw new Error("ticket has not been shared");
    }

    tickets[id] = {
      id,
      event: ticket.event,
      owner: ticket.owner,
      sharedWith: null,
    };
  }
}
