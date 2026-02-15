import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Homepage accessibility scan', async ({ page }) => {
  await page.goto('/index.html?lang=fr');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  // fail the test if there are any violations
  const violations = accessibilityScanResults.violations || [];
  if (violations.length) {
    console.log(JSON.stringify(violations, null, 2));
  }
  expect(violations.length).toBe(0);
});
