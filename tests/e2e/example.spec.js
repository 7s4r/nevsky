const { test, expect } = require('@playwright/test');

test.describe('Basic site checks', () => {
  test('Homepage loads and shows hero', async ({ page }) => {
    await page.goto('/index.html?lang=fr');
    await expect(page).toHaveTitle(/Église Orthodoxe Russe/);
    const hero = page.locator('section#accueil h1');
    await expect(hero).toBeVisible();
  });

  test('Mobile nav toggles and closes', async ({ page }) => {
    await page.goto('/index.html?lang=fr');
    // ensure mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    const menuBtn = page.locator('#menuBtn');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    const mobileMenu = page.locator('#mobileMenu');
    await expect(mobileMenu).toBeVisible();
    // click a link inside mobile menu
    const firstLink = mobileMenu.locator('a').first();
    await firstLink.click();
    await expect(mobileMenu).toBeHidden();
  });

  test('Footer links wrap without overflow on mobile', async ({ page }) => {
    await page.goto('/index.html?lang=ru');
    await page.setViewportSize({ width: 360, height: 800 });
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    // check no horizontal scrollbar on body
    const hasOverflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasOverflowX).toBeFalsy();
  });
});
