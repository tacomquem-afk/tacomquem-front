import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import testUsers from "./test-users.json";

type AuthFixtures = {
  authenticatedPage: Page;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

function getApiBaseUrl() {
  const configured =
    process.env.E2E_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    testUsers.api_base_url ??
    "http://localhost:3333";

  return configured.replace(/\/$/, "");
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, request, baseURL }, use) => {
    const [firstUser] = testUsers.users;
    if (!firstUser) {
      throw new Error("No test user available in tests/fixtures/test-users.json");
    }

    const apiBaseUrl = getApiBaseUrl();
    const loginResponse = await request.post(`${apiBaseUrl}/api/auth/login`, {
      data: {
        email: firstUser.email,
        password: firstUser.password,
      },
    });

    if (!loginResponse.ok()) {
      const details = await loginResponse.text();
      throw new Error(
        `Authentication failed (${loginResponse.status()}): ${details}`
      );
    }

    const { accessToken, refreshToken } =
      (await loginResponse.json()) as LoginResponse;
    if (!accessToken || !refreshToken) {
      throw new Error("Login response did not return accessToken/refreshToken");
    }

    await page.addInitScript(
      ({ nextAccessToken, nextRefreshToken }) => {
        localStorage.setItem("tcq_access_token", nextAccessToken);
        localStorage.setItem("tcq_refresh_token", nextRefreshToken);
      },
      { nextAccessToken: accessToken, nextRefreshToken: refreshToken }
    );

    const appUrl = baseURL ?? "http://localhost:3000";
    const expiresAt = Math.floor(Date.now() / 1000) + 86400;
    await page.context().addCookies([
      {
        name: "tcq_access_token",
        value: accessToken,
        url: appUrl || "http://localhost:3000",
        sameSite: "Lax",
        expires: expiresAt,
      },
      {
        name: "tcq_refresh_token",
        value: refreshToken,
        url: appUrl || "http://localhost:3000",
        sameSite: "Lax",
        expires: expiresAt,
      },
    ]);

    await use(page);
  },
});

export { expect };
