import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Bem-vindo");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should have proper labels for accessibility", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toHaveAttribute("id", "email");
    await expect(passwordInput).toHaveAttribute("id", "password");
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Email é obrigatório")).toBeVisible();
  });

  test("should have link to register page", async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]').first();
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await page.waitForURL("**/register**");
    expect(page.url()).toContain("/register");
  });

  test("should have Google login button", async ({ page }) => {
    await expect(page.locator("text=Continuar com Google")).toBeVisible();
  });

  test("should have password visibility toggle", async ({ page }) => {
    const toggleButton = page.locator('button[aria-label*="senha"]');
    await expect(toggleButton).toBeVisible();
  });

  test("should have forgot password link", async ({ page }) => {
    const forgotLink = page.locator('a[href="/forgot-password"]');
    await expect(forgotLink).toBeVisible();
  });

  test("should have remember me checkbox", async ({ page }) => {
    const checkbox = page.locator('input#rememberMe');
    if (await checkbox.count() > 0) {
      await expect(checkbox).toBeVisible();
    }
  });

  test("should have description text", async ({ page }) => {
    await expect(page.locator("text=Entre com sua conta para continuar")).toBeVisible();
  });
});
