import type { Locator, Page } from "@playwright/test";

/**
 * Component helpers for E2E tests
 */

/**
 * Wait for toast notification to appear and return its text
 */
export async function waitForToast(
  page: Page,
  timeout: number = 5000
): Promise<string> {
  const toast = page
    .locator('[data-testid="toast"]')
    .or(page.locator('[role="status"]'))
    .first();
  await toast.waitFor({ timeout });
  const text = await toast.textContent();
  return text ?? "";
}

/**
 * Wait for modal/dialog to be visible
 */
export async function waitForModal(
  page: Page,
  timeout: number = 5000
): Promise<Locator> {
  const modal = page.locator('[role="dialog"]').first();
  await modal.waitFor({ state: "visible", timeout });
  return modal;
}

/**
 * Close modal/dialog by clicking close button
 */
export async function closeModal(page: Page): Promise<void> {
  const closeButton = page
    .locator('[data-testid="dialog-close"]')
    .or(page.locator('[aria-label="Close"]'))
    .or(page.locator('button[data-state="open"] svg'));
  await closeButton.click();
}

/**
 * Fill form fields by data-testid or name
 */
export async function fillForm(
  page: Page,
  fields: Record<string, string>
): Promise<void> {
  for (const [field, value] of Object.entries(fields)) {
    const input = page
      .locator(`[data-testid="${field}"]`)
      .or(page.locator(`[name="${field}"]`))
      .or(page.locator(`[id="${field}"]`))
      .first();

    await input.fill(value);
  }
}

/**
 * Click button by data-testid, text, or role
 */
export async function clickButton(
  page: Page,
  identifier: string,
  options: { timeout?: number } = {}
): Promise<void> {
  const button = page
    .locator(`[data-testid="${identifier}"]`)
    .or(page.locator(`button:has-text("${identifier}")`))
    .or(page.locator(`[role="button"]:has-text("${identifier}")`))
    .first();

  await button.click(options);
}

/**
 * Get text content of element by data-testid
 */
export async function getText(
  page: Page,
  testId: string
): Promise<string | null> {
  const element = page.locator(`[data-testid="${testId}"]`).first();
  return element.textContent();
}

/**
 * Check if element exists by data-testid
 */
export async function elementExists(
  page: Page,
  testId: string
): Promise<boolean> {
  const element = page.locator(`[data-testid="${testId}"]`);
  return (await element.count()) > 0;
}

/**
 * Wait for loading state to complete
 */
export async function waitForLoading(
  page: Page,
  timeout: number = 10000
): Promise<void> {
  const loadingSelectors = [
    '[data-testid="loading-spinner"]',
    '[data-testid="loading"]',
    '[role="status"][aria-busy="true"]',
    ".loading",
    ".spinner",
  ];

  for (const selector of loadingSelectors) {
    const loading = page.locator(selector).first();
    const isVisible = await loading.isVisible().catch(() => false);

    if (isVisible) {
      await loading.waitFor({ state: "hidden", timeout }).catch(() => {});
    }
  }
}

/**
 * Select option from dropdown by text
 */
export async function selectOption(
  page: Page,
  triggerTestId: string,
  optionText: string
): Promise<void> {
  // Open dropdown
  await clickButton(page, triggerTestId);

  // Wait for dropdown to open
  await page.waitForTimeout(200);

  // Click option
  const option = page
    .locator('[role="option"]')
    .filter({ hasText: optionText })
    .first();
  await option.click();
}

/**
 * Check if element is visible
 */
export async function isVisible(page: Page, testId: string): Promise<boolean> {
  const element = page.locator(`[data-testid="${testId}"]`).first();
  return element.isVisible().catch(() => false);
}

/**
 * Upload file by input
 */
export async function uploadFile(
  page: Page,
  testId: string,
  filePath: string
): Promise<void> {
  const input = page.locator(`input[type="file"][data-testid="${testId}"]`);
  await input.setInputFiles(filePath);
}
