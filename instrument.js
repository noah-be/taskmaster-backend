import * as Sentry from "@sentry/node";

import("dotenv/config");

console.log("Instrumenting Sentry with Node Profiling");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE),
  profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE),
});
