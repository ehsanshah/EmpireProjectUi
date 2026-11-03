import {defineConfig} from '@playwright/test';

// Standard Playwright Chromium by default; an installed test-only binary may
// be supplied in restricted CI environments. Never targets a user's browser.
export default defineConfig({
  testDir:'tests/browser',
  testMatch:['workflowDesigner.spec.ts','phase13.spec.ts','phase13BoardConfig.spec.ts'],
  use:{
    baseURL:'http://127.0.0.1:5173',
    viewport:{width:1440,height:1000},
    launchOptions:{
      executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
      args:process.env.PLAYWRIGHT_CHROMIUM_ARGS?.split(' ').filter(Boolean),
    },
  },
  webServer:{command:'npm run dev -- --port 5173',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI},
  workers:1,
  reporter:'list',
});
