import { test, expect } from '@playwright/test';

// Visual regression tests using Playwright screenshots.
// To record baseline screenshots locally run: npm run visual:record
// CI should run `npm run test:visual` to compare against committed baselines.

test.describe('Visual regression', () => {
  test('Hero section (mobile)', async ({ page }) => {
    await page.goto('/index.html?lang=fr');
    await page.setViewportSize({ width: 360, height: 800 });
    const hero = page.locator('section#accueil');
    await expect(hero).toHaveScreenshot('hero-mobile.png', { animations: 'disabled' });
  });

  test('Footer (mobile)', async ({ page }) => {
    await page.goto('/index.html?lang=ru');
    await page.setViewportSize({ width: 360, height: 800 });
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-mobile.png', { animations: 'disabled' });
  });

  test('Hero section (desktop)', async ({ page }) => {
    await page.goto('/index.html?lang=fr');
    await page.setViewportSize({ width: 1280, height: 900 });
    const hero = page.locator('section#accueil');
    await expect(hero).toHaveScreenshot('hero-desktop.png', { animations: 'disabled' });
  });
});
