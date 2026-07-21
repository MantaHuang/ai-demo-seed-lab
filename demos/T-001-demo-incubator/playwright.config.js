import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  globalTimeout: 120000,
  timeout: 15000,
  reporter: "line",
  use: {
    baseURL: "http://t001.local",
    trace: "retain-on-failure"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], channel: "chromium" } }
  ]
});
