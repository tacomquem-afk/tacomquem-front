import { test, expect } from "../fixtures/auth.fixture";
import {
  navigateToDashboard,
  navigateToItems,
  navigateToLoans,
  navigateToProfile,
} from "../helpers/navigation.helper";

test.describe("Navigation", () => {
  test("should navigate to dashboard", async ({ authenticatedPage }) => {
    await navigateToDashboard(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/dashboard");
  });

  test("should navigate to items page", async ({ authenticatedPage }) => {
    await navigateToItems(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/items");
  });

  test("should navigate to loans page", async ({ authenticatedPage }) => {
    await navigateToLoans(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/loans");
  });

  test("should navigate to profile page", async ({ authenticatedPage }) => {
    await navigateToProfile(authenticatedPage);
    expect(authenticatedPage.url()).toContain("/profile");
  });

  test("should have navigation menu", async ({ authenticatedPage }) => {
    await navigateToDashboard(authenticatedPage);
    // Verificar se menu de navegação existe
    const navMenu = authenticatedPage.locator("nav");
    await expect(navMenu).toBeVisible();
  });
});
