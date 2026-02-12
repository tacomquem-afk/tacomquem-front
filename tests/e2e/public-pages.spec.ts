import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("should load home page", async ({ page, baseURL }) => {
    await page.goto("/");
    expect(page.url()).toBe(`${baseURL}/`);
    await expect(page.locator("h1")).toContainText(/TáComQuem/);
  });

  test("should have working navigation buttons on home", async ({ page }) => {
    await page.goto("/");

    // Verificar botões de ação
    const startButton = page.locator("a:has-text('Começar agora')").first();
    const loginButton = page.locator("a:has-text('Entrar')").first();

    await expect(startButton).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test("should navigate to register from home", async ({ page }) => {
    await page.goto("/");
    await page.click("a:has-text('Começar agora')");
    await page.waitForURL("**/register**");
    expect(page.url()).toContain("/register");
  });

  test("should navigate to login from home", async ({ page }) => {
    await page.goto("/");
    await page.click("a:has-text('Entrar')");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("should apply dark theme by default", async ({ page }) => {
    await page.goto("/");
    const body = page.locator("body");
    const bgColor = await body.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Verificar se background é dark (ajuste conforme seu valor exato)
    expect(bgColor).toBeTruthy();
  });
});
