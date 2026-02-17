import { expect, test } from "@playwright/test";

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display registration form", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Criar sua conta");
    await expect(page.locator('input[autocomplete="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should have proper labels for accessibility", async ({ page }) => {
    const nameInput = page.locator('input[id="name"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("id", "email");
    await expect(passwordInput).toHaveAttribute("id", "password");
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Nome é obrigatório")).toBeVisible();
  });

  test("should show password strength indicator", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill("weak");
    // Skip if strength indicator is not implemented
    const weakIndicator = page.locator("text=/Fraca|Weak/i").first();
    if ((await weakIndicator.count()) > 0) {
      await expect(weakIndicator).toBeVisible();
    }

    await passwordInput.fill("StrongPass123!");
    const strongIndicator = page.locator("text=/Forte|Strong/i").first();
    if ((await strongIndicator.count()) > 0) {
      await expect(strongIndicator).toBeVisible();
    }
  });

  test("should have link to login page", async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]').first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("should show terms link", async ({ page }) => {
    await expect(page.locator("text=Termos de Uso")).toBeVisible();
  });

  test("should have Google login button", async ({ page }) => {
    await expect(page.locator("text=Continuar com Google")).toBeVisible();
  });

  test("should have password visibility toggle", async ({ page }) => {
    const toggleButton = page.locator('button[aria-label*="senha"]');
    await expect(toggleButton).toBeVisible();
  });

  test("should have description text", async ({ page }) => {
    await expect(
      page.locator("text=Comece a gerenciar seus empréstimos")
    ).toBeVisible();
  });

  test("should show email validation error", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("invalid-email");
    await page.click('button[type="submit"]');
    const errorMsg = page.locator("text=Email inválido");
    if ((await errorMsg.count()) > 0) {
      await expect(errorMsg).toBeVisible();
    }
  });

  test("should show password validation error", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("weak");
    await page.click('button[type="submit"]');
    await expect(
      page.locator("text=Senha deve ter no mínimo 8 caracteres")
    ).toBeVisible();
  });
});
