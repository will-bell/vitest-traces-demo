import { exporter } from "../src/tracing";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { createServer, Server } from "http";
import app from "../src/app";

describe("Basic app behavior", () => {
  let server: Server;
  let port: number = 3000;

  beforeAll(async () => {
    server = createServer(app);
    await new Promise<void>((resolve) => server.listen(port, () => resolve()));
  });

  afterAll(() => {
    server.close();
  });

  test("spans are exported", async () => {
    const res = await fetch(`http://localhost:${port}/ticket`, {
      method: "POST",
      headers: { authorization: "token" },
    });
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(2);
    console.log(spans);
  });
});
