import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: 1,

  // The public ParaBank instance has shared mutable state; parallel workers
  // can reset the database while another scenario is using it.
  workers: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['./reporter/custom-reporter.ts']
  ],

  use: {
    baseURL: 'https://parabank.parasoft.com',

    headless: true,

    screenshot: 'only-on-failure',

    trace: 'retain-on-failure',

    video: 'retain-on-failure',

    actionTimeout: 10000,

    navigationTimeout: 45000
  },

  timeout: 60000,
  expect: {
    timeout: 15000
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});