import { defineConfig } from "cypress";
import defu from "defu";
import defaultConfig from "./default";

export default defineConfig(
  defu(
    {
      viewportWidth: 411,
      viewportHeight: 731,
      userAgent:
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      e2e: {
        specPattern: "cypress/e2e/mobile/**/*.cy.{js,jsx,ts,tsx}"
      }
    },
    defaultConfig
  )
);
