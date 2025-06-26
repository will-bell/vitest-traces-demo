import { test, expect, beforeAll } from "vitest";
import SpansAssertionContext from "./SpanAssertionContext";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { randomUUID } from "crypto";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

const client = new PGlite();
const db = drizzle(client, { schema });

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "drizzle/" });
});

test("basic assertions", async () => {
  await db
    .insert(schema.spansTable)
    .values([
      {
        id: "051581bf3cb55c13",
        traceId: "5b8aa5a2d2c872e8321cf37308d69df2",
        parentId: null,
        name: "hello-trace-testing",
        startTime: new Date(),
        endTime: new Date(),
        attributes: { "http.method": "GET" },
        status: "0",
        testName: "testName",
      },
    ])
    .onConflictDoNothing();

  const spans = new SpansAssertionContext(db, "testName");

  const result = await spans.with
    .name("hello-trace-testing")
    .have.attribute("http.method", "GET");

  expect(result).toBe(true);
});
