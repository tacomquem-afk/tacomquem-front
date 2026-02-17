import { expect, test } from "@playwright/test";

test.describe("Button Component", () => {
  test("should render button", async ({ page }) => {
    // Navegar para uma página que tenha botões (ex: home)
    await page.goto("/");
    const button = page.locator("button").first();
    await expect(button).toBeVisible();
  });

  test("should have hover state", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("button").first();

    // Hover over button
    await button.hover();

    // Verificar estilos de hover (ajuste conforme seu CSS)
    const computedStyle = await button.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });

    expect(computedStyle).toBe("pointer");
  });

  test("should be clickable", async ({ page }) => {
    await page.goto("/login");
    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeEnabled();
  });
});
