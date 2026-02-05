import { test, expect } from "@playwright/test";
import {
  loginAsUser,
  registerNewUser,
  logoutUser,
} from "../helpers/auth.helper";

test.describe("Authentication Flow", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");
    expect(page.url()).toContain("/login");
    await expect(page.locator("h1")).toContainText(/login|entrar/i);
  });

  test("should display register page", async ({ page }) => {
    await page.goto("/register");
    expect(page.url()).toContain("/register");
    await expect(page.locator("h1")).toContainText(/register|cadastro/i);
  });

  test("should login successfully with valid credentials", async ({
    page,
  }) => {
    // Note: Substitua com credenciais de teste reais
    await loginAsUser(page);
    expect(page.url()).toContain("/dashboard");
  });

  test("should logout successfully", async ({ page, context }) => {
    // Setup: login
    await context.addCookies([
      {
        name: "tcq_access_token",
        value: "valid_token",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/dashboard");
    await logoutUser(page);
    expect(page.url()).toContain("/login");
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Aguardar mensagem de erro
    await expect(page.locator("[role=\"alert\"]")).toBeVisible();
  });

  test("should register new user successfully", async ({ page }) => {
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;

    await registerNewUser(page, "New Test User", email);
    // Verificar se foi redirecionado após registro
    expect(page.url()).toMatch(/\/(login|dashboard)/);
  });
});
