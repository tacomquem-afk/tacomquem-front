import type { Page } from "@playwright/test";

export async function navigateToDashboard(page: Page) {
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
}

export async function navigateToItems(page: Page) {
  await page.goto("/dashboard/items");
  await page.waitForLoadState("networkidle");
}

export async function navigateToLoans(page: Page) {
  await page.goto("/dashboard/loans");
  await page.waitForLoadState("networkidle");
}

export async function navigateToProfile(page: Page) {
  await page.goto("/dashboard/profile");
  await page.waitForLoadState("networkidle");
}
