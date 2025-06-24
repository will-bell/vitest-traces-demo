import {
  InMemorySpanExporter,
  SimpleSpanProcessor,
  SpanExporter,
} from "@opentelemetry/sdk-trace-base";
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  TracerProvider,
} from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import FastifyOtelInstrumentation from "@fastify/otel";

const setupOtel = (serviceName: string): [TracerProvider, SpanExporter] => {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

  const exporter = new InMemorySpanExporter();
  const provider = new NodeTracerProvider({
    resource: new Resource({ [ATTR_SERVICE_NAME]: serviceName }),
    spanProcessors: [new SimpleSpanProcessor(exporter)],
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new HttpInstrumentation()],
  });
  provider.register();

  return [provider, exporter];
};

const setupFastifyOtelPlugin = (
  provider: TracerProvider,
  serverName: string
): FastifyOtelInstrumentation => {
  const instrumentation = new FastifyOtelInstrumentation({
    servername: serverName,
  });
  instrumentation.setTracerProvider(provider);

  return instrumentation;
};

export { setupOtel, setupFastifyOtelPlugin };
