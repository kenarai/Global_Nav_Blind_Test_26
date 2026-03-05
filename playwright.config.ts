import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the Global Nav Blind Test.
 *
 * Three test projects run in parallel, one per navigation option.
 * Each project targets the Vite dev server for its option:
 *   option-1 → http://localhost:5171
 *   option-2 → http://localhost:5172
 *   option-3 → http://localhost:5173
 *
 * Run all tests:          npm run test:e2e
 * Install browsers once:  npx playwright install
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  projects: [
    {
      name: 'option-1',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5171',
      },
    },
    {
      name: 'option-2',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5172',
      },
    },
    {
      name: 'option-3',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:1',
      url: 'http://localhost:5171',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm run dev:2',
      url: 'http://localhost:5172',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm run dev:3',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
  outputDir: 'test-results',
});
