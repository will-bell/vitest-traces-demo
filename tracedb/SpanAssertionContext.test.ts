import { test, expect, beforeEach } from "vitest";
import SpansAssertionContext from "./SpanAssertionContext";
import { drizzle, PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { randomUUID } from "crypto";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

const client = new PGlite();
const db = drizzle(client, { schema });

beforeEach(async () => {
  await migrate(db, { migrationsFolder: "drizzle/" });
});

test("basic assertions", async () => {
  // 👇 Simulate a span inserted into the database
  await db.insert(schema.spansTable).values([
    {
      id: randomUUID(),
      traceId: randomUUID(),
      parentId: null,
      name: "hello-trace-testing",
      startTime: new Date(),
      endTime: new Date(),
      attributes: { "http.method": "GET" },
      status: "0",
      testName: "testName",
    },
  ]);
  // .onConflictDoNothing();

  const spans = new SpansAssertionContext(db as any, "testName");

  // 👇 DSL-style assertion
  const result = await spans.with
    .name("hello-trace-testing")
    .have.attribute("http.method", "GET");

  expect(result).toBe(true);
});
