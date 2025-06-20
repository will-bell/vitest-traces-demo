// import { describe, test, expect, beforeAll, afterAll } from "vitest";
// import { createServer, Server } from "http";
// import app from "../src/app";

// describe("Basic app behavior", () => {
//   let server: Server;
//   let port: number = 3001;

//   beforeAll(async () => {
//     server = createServer(app);
//     await new Promise<void>((resolve) => server.listen(port, () => resolve()));
//   });

//   afterAll(() => {
//     server.close();
//   });

//   test("POST /ticket should return confirmation", async () => {
//     const res = await fetch(`http://localhost:${port}/ticket`, {
//       method: "POST",
//       headers: { authorization: "token" },
//     });

//     const text = await res.text();
//     expect(res.status).toBe(200);
//     expect(text).toMatch(/Ticket created/);
//   });

//   test("POST /ticket/transfer should return confirmation", async () => {
//     const res = await fetch(`http://localhost:${port}/ticket/transfer`, {
//       method: "POST",
//       headers: { authorization: "token" },
//     });

//     const text = await res.text();
//     expect(res.status).toBe(200);
//     expect(text).toMatch(/Ticket transferred/);
//   });
// });
