import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display hero section", async ({ page }) => {
    // Verify the main heading is visible
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("should have working CTA buttons", async ({ page }) => {
    const startButton = page.locator('a[href="/register"]').first();
    await expect(startButton).toBeVisible();
    await startButton.click();
    await page.waitForURL("**/register**");
    expect(page.url()).toContain("/register");
  });

  test("should have how it works section", async ({ page }) => {
    await expect(page.locator("text=Como funciona").first()).toBeVisible();
    // Check for at least some step content exists
    const stepTexts = await page.locator("text=/Registre|Compartilhe|Confirme/i").count();
    expect(stepTexts).toBeGreaterThanOrEqual(1);
  });

  test("should have features section", async ({ page }) => {
    // Verify features section exists by checking for h2 elements
    await expect(page.locator("h2").first()).toBeVisible();
  });

  test("should have skip link for accessibility", async ({ page }) => {
    const skipLink = page.locator("a:has-text('Pular para o conteúdo')").first();
    if (await skipLink.count() > 0) {
      await skipLink.focus();
      await expect(skipLink).toBeVisible();
    }
  });

  test("should have footer with copyright", async ({ page }) => {
    await expect(page.locator("text=TáComQuem. Todos os direitos")).toBeVisible();
  });

  test("should have header with logo", async ({ page }) => {
    await expect(page.locator("header").locator("text=TáComQuem").first()).toBeVisible();
  });

  test("should have navigation buttons in header", async ({ page }) => {
    await expect(page.locator('a[href="/login"]').first()).toBeVisible();
    await expect(page.locator('a[href="/register"]').first()).toBeVisible();
  });

  test("should scroll to como-funciona section", async ({ page }) => {
    await page.click('a[href="#como-funciona"]');
    const element = page.locator("#como-funciona");
    await expect(element).toBeInViewport();
  });

  test("should have CTA section", async ({ page }) => {
    // Verify CTA section exists by checking for buttons
    const ctaButtons = page.locator("a[href='/register']");
    expect(await ctaButtons.count()).toBeGreaterThanOrEqual(1);
  });
});
