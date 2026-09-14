import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

/** The full regression suite, run at three widths on Chromium. */
const REGRESSION = /(pages|a11y)\.spec\.ts/;
/** Viewport-independent assertions about what every page says. Run once. */
const CONSISTENCY = /consistency\.spec\.ts/;
/** The narrow-phone pass. Sets its own viewports. Run once. */
const NARROW = /narrow\.spec\.ts/;
/** The small suite worth paying for on every engine. */
const SMOKE = /cross-browser\.spec\.ts/;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      testMatch: REGRESSION,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'tablet',
      testMatch: REGRESSION,
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
    },
    { name: 'mobile', testMatch: REGRESSION, use: { ...devices['Pixel 7'] } },

    { name: 'consistency', testMatch: CONSISTENCY, use: { ...devices['Desktop Chrome'] } },
    { name: 'narrow', testMatch: NARROW, use: { ...devices['Desktop Chrome'] } },

    // Three engines, plus a modern iPhone profile for mobile WebKit. Deliberately
    // only the smoke suite: the regression suite is not multiplied across engines.
    { name: 'smoke-chromium', testMatch: SMOKE, use: { ...devices['Desktop Chrome'] } },
    { name: 'smoke-firefox', testMatch: SMOKE, use: { ...devices['Desktop Firefox'] } },
    { name: 'smoke-webkit', testMatch: SMOKE, use: { ...devices['Desktop Safari'] } },
    { name: 'smoke-webkit-mobile', testMatch: SMOKE, use: { ...devices['iPhone 15'] } },
  ],
  webServer: {
    command: `node scripts/serve.mjs ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
