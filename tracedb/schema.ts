import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  char,
} from "drizzle-orm/pg-core";

export const spansTable = pgTable("spans", {
  id: char("span_id", { length: 16 }).primaryKey(),
  traceId: char("trace_id", { length: 32 }).notNull(),
  parentId: char("parent_id", { length: 16 }),
  name: text("name").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  attributes: jsonb("attributes").notNull(),
  status: text("status"),
  testName: text("test_name"),
});

export const spanEventsTable = pgTable("span_events", {
  id: uuid("id").primaryKey(),
  spanId: char("span_id", { length: 16 })
    .notNull()
    .references(() => spansTable.id),
  name: text("name").notNull(),
  time: timestamp("time", { withTimezone: true }).notNull(),
  attributes: jsonb("attributes").notNull(),
});
