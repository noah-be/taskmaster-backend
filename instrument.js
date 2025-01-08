import * as Sentry from "@sentry/node";

console.log("Instrumenting Sentry with Node Profiling");

Sentry.init({
  dsn: "https://6bbcb2a8f911bc91b3c2c01c51f045e2@o4508607145967616.ingest.de.sentry.io/4508608440041552",
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
