import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  use: {
    baseURL: "http://127.0.0.1:4321",
    browserName: "chromium",
  },

  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

// What this configuration does
// - testDir — Tells Playwright where our automated test files will live.
// - baseURL — Points tests to your locally running Astro website,
// not your deployed Vercel site.
// - browserName — Uses the Chromium browser we just installed.
// - webServer — Automatically starts your Astro development server when running tests,
// so you won't need to start it manually.
// - reuseExistingServer — Allows Playwright to reuse your running local
// server during development, but not in CI.
