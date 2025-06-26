CREATE TABLE spans (
    id UUID PRIMARY KEY,
    trace_id UUID NOT NULL,
    parent_id UUID,
    name TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    attributes JSONB NOT NULL,
    status TEXT,
    test_name TEXT,
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES spans (id) ON DELETE CASCADE
);

CREATE TABLE span_events (
    id UUID PRIMARY KEY,
    span_id UUID NOT NULL,
    name TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    attributes JSONB NOT NULL,
    CONSTRAINT fk_span FOREIGN KEY (span_id) REFERENCES spans (id) ON DELETE CASCADE
);

CREATE INDEX idx_span_events_span_id ON span_events (span_id);
CREATE INDEX idx_span_events_time ON span_events (time);