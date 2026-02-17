import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./tests/types";

/**
 * Playwright E2E Test Configuration
 *
 * Environment variables:
 * - BASE_URL: Base URL for tests (default: http://localhost:3000)
 * - PLAYWRIGHT_HEADLESS: Run headless (default: "1")
 * - CI: Run in CI mode
 *
 * @see https://playwright.dev/docs/test-configuration
 */
const shouldRunHeadless = process.env.PLAYWRIGHT_HEADLESS !== "0";

export default defineConfig<TestOptions>({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    headless: shouldRunHeadless,
    trace: process.env.CI ? "retain-on-failure" : "on-first-retry",
    screenshot: "only-on-failure",
    video: process.env.CI ? "retain-on-failure" : "off",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    timeout: 180 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  expect: {
    timeout: 10 * 1000,
  },
});
