import { defineConfig } from 'cypress';
import defu from 'defu';
import defaultConfig from './default';

export default defineConfig(
  defu(
    {
      viewportWidth: 1920,
      viewportHeight: 1080,
      e2e: {
        specPattern: 'cypress/e2e/desktop/**/*.cy.{js,jsx,ts,tsx}'
      }
    },
    defaultConfig
  )
);