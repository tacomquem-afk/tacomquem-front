import type { Page } from "@playwright/test";

/**
 * Custom test options extending Playwright's default TestOptions
 */
export interface TestOptions {
  /**
   * Authenticated page fixture
   */
  authenticatedPage: Page;
}

/**
 * Test user credentials for E2E testing
 */
export const TEST_USERS = {
  VALID: {
    email: "test@example.com",
    password: "Test123456!",
    name: "Test User",
  },
  INVALID: {
    email: "invalid@example.com",
    password: "WrongPassword123!",
  },
} as const;

/**
 * API response types
 */
export type ApiAuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

/**
 * Test data helpers
 */
export const TEST_DATA = {
  ITEM: {
    VALID_NAME: "My Test Item",
    VALID_DESCRIPTION: "This is a test item description",
    LONG_NAME: "a".repeat(101), // Exceeds max length
  },
  LOAN: {
    VALID_DAYS: 7,
    INVALID_DAYS: -1,
  },
} as const;
