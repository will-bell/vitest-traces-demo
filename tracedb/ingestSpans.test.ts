import { test, expect, vi } from "vitest";
import { ingestSpans } from "../tracedb/ingestSpans";
import { ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { spansTable, spanEventsTable } from "../tracedb/schema";

test("ingestSpans inserts spans and events into the database", async () => {
  const mockInsert = vi.fn(() => ({
    values: vi.fn().mockReturnThis(),
    onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
  }));

  const mockDb = {
    insert: mockInsert,
  };

  const span = createFakeSpan({
    name: "mock-operation",
    attributes: { "db.system": "postgres" },
    events: [
      {
        name: "exception",
        time: [Math.floor(Date.now() / 1000), 0],
        attributes: { "exception.message": "Something went wrong" },
      },
    ],
  });

  await ingestSpans(mockDb as any, "trace-test", [span]);

  expect(mockInsert).toHaveBeenCalledWith(spansTable);
  expect(mockInsert).toHaveBeenCalledWith(spanEventsTable);
});

function createFakeSpan(partial: Partial<ReadableSpan>): ReadableSpan {
  const now = Date.now();
  return {
    name: "fake-span",
    spanContext: () => ({
      traceId: "abc123",
      spanId: "def456",
      traceFlags: 1,
      isRemote: false,
    }),
    parentSpanId: undefined,
    startTime: [Math.floor(now / 1000), (now % 1000) * 1e6],
    endTime: [Math.floor(now / 1000) + 1, ((now + 1000) % 1000) * 1e6],
    attributes: {},
    status: { code: 1 },
    events: [],
    ...partial,
  } as ReadableSpan;
}
