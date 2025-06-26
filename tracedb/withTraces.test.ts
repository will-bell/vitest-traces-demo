import { test, expect, vi, RunnerTestCase } from "vitest";
import { withTraces } from "../tracedb/withTraces";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import {
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { trace } from "@opentelemetry/api";
import { spansTable, spanEventsTable } from "./schema";

test("withTraces runs test, generates span, and calls ingestSpans", async () => {
  // Arrange
  const exporter = new InMemorySpanExporter();
  const provider = new NodeTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(exporter)],
  });
  const tracer = provider.getTracer("test-tracer");

  const mockDb = createMockDb() as any;

  const fakeTask = {
    name: "test-task",
    type: "test",
  } as RunnerTestCase;

  const testFn = vi.fn(() => {
    const span = trace.getActiveSpan();
    return "test-result";
  });

  // Act
  const { result, spans } = await withTraces(
    mockDb,
    fakeTask,
    exporter,
    tracer,
    testFn
  );

  // Assert
  expect(result).toBe("test-result");
  expect(testFn).toHaveBeenCalled();
  expect(spans.length).toBeGreaterThan(0);
  expect(spans[0].name).toBe("test-task");
});

const memory = {
  spans: [] as any[],
  span_events: [] as any[],
};

function createMockDb() {
  return {
    insert: (table: any) => ({
      values: (rows: any[]) => {
        const tableName = getTableName(table);
        memory[tableName].push(...rows);
        return {
          onConflictDoNothing: async () => {},
        };
      },
    }),
    select: () => ({
      from: (table: any) => ({
        where: (predicate: (row: any) => boolean) => {
          const tableName = getTableName(table);
          return memory[tableName].filter(predicate);
        },
      }),
    }),
    _memory: memory,
  };
}

function getTableName(table: any): keyof typeof memory {
  if (table === spansTable) return "spans";
  if (table === spanEventsTable) return "span_events";
  throw new Error("Unsupported table");
}
