export type Ticket = {
  id: string;
  owner: string;
};

const tickets: Record<string, Ticket> = {};

export function createTicket(id: string, owner: string) {
  tickets[id] = { id, owner };
}

export function transferTicket(id: string, to: string) {
  if (!tickets[id]) throw new Error("Ticket not found");
  tickets[id].owner = to;
}
