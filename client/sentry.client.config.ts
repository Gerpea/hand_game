// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { CaptureConsole } from "@sentry/integrations";

Sentry.init({
  dsn: "https://0abe48dfd6fcc4630b9790da3c27e5fc@o4506080160448512.ingest.sentry.io/4506080161759232",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  integrations: [
    new CaptureConsole(),
  ],
});
