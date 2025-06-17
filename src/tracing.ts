import {
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { Tracer, trace } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";

export const setupTracing = (
  serviceName: string
): [Tracer, InMemorySpanExporter] => {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

  const exporter = new InMemorySpanExporter();
  const provider = new NodeTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(exporter)],
  });
  provider.register();

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
  });

  return [trace.getTracer(serviceName), exporter];
};

const [tracer, exporter] = setupTracing("ticket-service");

export { tracer, exporter };
