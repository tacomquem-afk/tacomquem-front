import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display hero section", async ({ page }) => {
    await expect(
      page.locator("text=Nunca mais esqueça quem está com suas coisas")
    ).toBeVisible();
  });

  test("should have working CTA buttons", async ({ page }) => {
    const startButton = page.locator('a[href="/register"]').first();
    await expect(startButton).toBeVisible();
    await startButton.click();
    expect(page.url()).toContain("/register");
  });

  test("should have how it works section", async ({ page }) => {
    await expect(page.locator("text=Como funciona")).toBeVisible();
    await expect(page.locator("text=Registre o item")).toBeVisible();
    await expect(page.locator("text=Compartilhe o link")).toBeVisible();
    await expect(page.locator("text=Confirme a devolução")).toBeVisible();
  });

  test("should have features section", async ({ page }) => {
    await expect(page.locator("text=Tudo que você precisa")).toBeVisible();
  });

  test("should have skip link for accessibility", async ({ page }) => {
    const skipLink = page.locator("text=Pular para o conteúdo");
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test("should have footer with copyright", async ({ page }) => {
    await expect(page.locator("text=TáComQuem. Todos os direitos")).toBeVisible();
  });

  test("should have header with logo", async ({ page }) => {
    await expect(page.locator("text=TáComQuem")).toBeVisible();
  });

  test("should have navigation buttons in header", async ({ page }) => {
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  test("should scroll to como-funciona section", async ({ page }) => {
    await page.click('a[href="#como-funciona"]');
    const element = page.locator("#como-funciona");
    await expect(element).toBeInViewport();
  });

  test("should have CTA section", async ({ page }) => {
    await expect(page.locator("text=Pronto para organizar seus empréstimos")).toBeVisible();
    await expect(page.locator("text=Crie sua conta gratuitamente")).toBeVisible();
  });
});
