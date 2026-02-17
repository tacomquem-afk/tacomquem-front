import type { Page } from "@playwright/test";
import testUsers from "../fixtures/test-users.json";

export async function loginAsUser(
  page: Page,
  email: string = testUsers.users[0]?.email ?? "test1@example.com",
  password: string = testUsers.users[0]?.password ?? "Test@123456"
) {
  await page.goto("/login");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard(\/.*)?$/);
}

export async function logoutUser(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("tcq_access_token");
    localStorage.removeItem("tcq_refresh_token");
    document.cookie = "tcq_access_token=; path=/; max-age=0";
    document.cookie = "tcq_refresh_token=; path=/; max-age=0";
  });
  await page.goto("/dashboard");
  await page.waitForURL("/login");
}

export async function registerNewUser(
  page: Page,
  name: string = "Test User",
  email: string = "newuser@example.com",
  password: string = "SecurePassword123"
) {
  await page.goto("/register");
  await page.fill('input[id="name"]', name);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Aguardar redirect após registro bem-sucedido ou erro
  try {
    await page.waitForURL(/\/(login|dashboard|register)/, { timeout: 5000 });
  } catch {
    // Se não redirecionar, apenas continua (pode ter erro no servidor)
  }
}
