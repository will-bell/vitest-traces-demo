// import setupTracing from "../src/tracing";
// setupTracing("test-ticket-service");
import app from "../src/app.mts";

import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { Server, createServer } from "http";

describe("Basic app behavior", () => {
  let server: Server;
  let port: number = 3000;

  beforeAll(async () => {
    app.listen({ port: 3000 });
  });

  test("spans are exported", async () => {
    await fetch("http://localhost:3000/ticket");
    // const spans = (<InMemorySpanExporter>exporter).getFinishedSpans();
    // expect(spans).toHaveLength(1);
    // console.log(spans);
  });
});
