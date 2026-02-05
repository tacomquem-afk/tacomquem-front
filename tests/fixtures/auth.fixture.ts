import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Mock de login - você pode substituir com real API calls
    await page.context().addCookies([
      {
        name: "tcq_access_token",
        value: "mock_token_for_testing",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Date.now() / 1000 + 86400,
      },
    ]);

    await use(page);
  },
});

export { expect };
