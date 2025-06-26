import {
  InMemorySpanExporter,
  ReadableSpan,
} from "@opentelemetry/sdk-trace-base";
import { RunnerTask } from "vitest";
import { ingestSpans } from "./ingestSpans";
import { Tracer } from "@opentelemetry/api";
import { Database } from "./types";
import SpansAssertionContext from "./SpanAssertionContext";

export async function withTraces<T>(
  db: Database,
  task: Readonly<RunnerTask>,
  exporter: InMemorySpanExporter,
  tracer: Tracer,
  test: () => Promise<T> | T
): Promise<{ result: T; spans: SpansAssertionContext }> {
  let result: T;

  await tracer.startActiveSpan(task.name, async (span) => {
    try {
      result = await test();
    } finally {
      span.end();
    }
  });

  const spans = exporter.getFinishedSpans();
  await ingestSpans(db, task.name, spans);

  return {
    result: result!,
    spans: new SpansAssertionContext(db, task.name),
  };
}
