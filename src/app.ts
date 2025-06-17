import { tracer } from "./tracing";
import express from "express";
import { createTicket, transferTicket } from "./ticket";
import { SpanStatusCode, trace } from "@opentelemetry/api";

const app = express();

app.use((req, res, next) => {
  tracer.startActiveSpan("auth", (span) => {
    const authtoken = req.headers["authorization"];
    if (authtoken === undefined) {
      span.recordException("unauthorized");
      span.setStatus({ code: SpanStatusCode.ERROR, message: "unauthorized" });

      span.end();
      res.status(403);
      res.send();
    }
    console.log("Auth token:", authtoken);
    span.end();
  });
  next();
});

app.post("/ticket", (req, res) => {
  trace
    .getActiveSpan()
    ?.setAttributes({ header: "cookie", header2: "cookie2" });
  createTicket("T1", "alice");
  res.send("Ticket created");
});

app.post("/ticket/transfer", (req, res) => {
  transferTicket("T1", "bob");
  res.send("Ticket transferred");
});

export default app;
