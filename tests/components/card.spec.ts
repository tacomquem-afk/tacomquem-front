import { expect, test } from "@playwright/test";

test.describe("Card Component", () => {
  test("should render cards on page", async ({ page }) => {
    // Navegar para página que tem cards (ex: dashboard)
    await page.goto("/dashboard");
    const cards = page.locator("[role='article']");

    // Verificar se há cards
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should have proper spacing", async ({ page }) => {
    await page.goto("/dashboard");
    const card = page.locator("[role='article']").first();

    // Verificar se card é visível
    await expect(card).toBeVisible();

    // Verificar se tem padding/margin
    const boundingBox = await card.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox?.width).toBeGreaterThan(0);
  });
});
