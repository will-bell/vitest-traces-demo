import { spansTable, spanEventsTable } from "./schema";
import { ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { v4 as uuidv4 } from "uuid";
import { Database, Schema } from "./types";

export async function ingestSpans(
  db: Database,
  testName: string,
  spans: ReadableSpan[]
) {
  const spanValues = spans.map((span) => ({
    testName,
    id: span.spanContext().spanId,
    traceId: span.spanContext().traceId,
    parentId: span.parentSpanId || null,
    name: span.name,
    startTime: new Date(span.startTime[0] * 1000 + span.startTime[1] / 1e6),
    endTime: new Date(span.endTime[0] * 1000 + span.endTime[1] / 1e6),
    attributes: span.attributes,
    status: span.status.code.toString(),
  }));

  const eventValues = spans.flatMap((span) =>
    span.events.map((event) => ({
      id: uuidv4(),
      spanId: span.spanContext().spanId,
      name: event.name,
      time: new Date(event.time[0] * 1000 + event.time[1] / 1e6),
      attributes: event.attributes,
    }))
  );

  await db.insert(spansTable).values(spanValues).onConflictDoNothing();
  if (eventValues.length) {
    await db.insert(spanEventsTable).values(eventValues).onConflictDoNothing();
  }
}
