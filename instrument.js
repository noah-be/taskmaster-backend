import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export function initSentry() {
  Sentry.init({
    dsn: "https://6bbcb2a8f911bc91b3c2c01c51f045e2@o4508607145967616.ingest.de.sentry.io/4508608440041552",
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
  });
}

export function startProfiling() {
  Sentry.profiler.startProfiler();
}

export function stopProfiling() {
  Sentry.profiler.stopProfiler();
}

export { Sentry };
