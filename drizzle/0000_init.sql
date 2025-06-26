CREATE TABLE "span_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"span_id" uuid NOT NULL,
	"name" text NOT NULL,
	"time" timestamp with time zone NOT NULL,
	"attributes" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spans" (
	"id" uuid PRIMARY KEY NOT NULL,
	"trace_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"attributes" jsonb NOT NULL,
	"status" text,
	"test_name" text
);
--> statement-breakpoint
ALTER TABLE "span_events" ADD CONSTRAINT "span_events_span_id_spans_id_fk" FOREIGN KEY ("span_id") REFERENCES "public"."spans"("id") ON DELETE no action ON UPDATE no action;