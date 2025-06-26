import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const spansTable = pgTable("spans", {
  id: uuid("id").primaryKey(),
  traceId: uuid("trace_id").notNull(),
  parentId: uuid("parent_id"),
  name: text("name").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  attributes: jsonb("attributes").notNull(),
  status: text("status"),
  testName: text("test_name"),
});

export const spanEventsTable = pgTable("span_events", {
  id: uuid("id").primaryKey(),
  spanId: uuid("span_id")
    .notNull()
    .references(() => spansTable.id),
  name: text("name").notNull(),
  time: timestamp("time", { withTimezone: true }).notNull(),
  attributes: jsonb("attributes").notNull(),
});
