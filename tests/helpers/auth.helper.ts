import type { Page } from "@playwright/test";

export async function loginAsUser(
  page: Page,
  email: string = "test@example.com",
  password: string = "password123",
) {
  await page.goto("/login");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/dashboard");
}

export async function logoutUser(page: Page) {
  // Assumindo que há um botão de logout no header
  await page.click('[data-testid="user-menu-button"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL("/login");
}

export async function registerNewUser(
  page: Page,
  name: string = "Test User",
  email: string = "newuser@example.com",
  password: string = "SecurePassword123",
) {
  await page.goto("/register");
  await page.fill('input[placeholder*="nome"]', name);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Aguardar redirect após registro bem-sucedido
  await page.waitForURL(/\/(login|dashboard)/);
}
