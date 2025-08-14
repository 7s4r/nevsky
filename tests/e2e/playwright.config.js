import { devices } from '@playwright/test';

export default {
  testDir: './',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  use: {
    baseURL: 'http://127.0.0.1:5500',
    headless: true,
  },
};
