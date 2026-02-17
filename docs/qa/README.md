# QA (Quality Assurance) Guide

This document describes the QA setup and testing practices for the TáComQuem Frontend project.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Overview

This project uses a comprehensive testing strategy:

- **Unit Tests**: Vitest for fast, isolated unit tests
- **E2E Tests**: Playwright for end-to-end browser testing
- **Linting**: Biome for code quality and formatting
- **Type Checking**: TypeScript for type safety

---

## Tech Stack

| Tool | Purpose | Version |
|------|---------|---------|
| [Vitest](https://vitest.dev/) | Unit testing framework | ^4.0.18 |
| [Playwright](https://playwright.dev/) | E2E testing framework | ^1.58.1 |
| [Biome](https://biomejs.dev/) | Linting & formatting | ^2.3.14 |
| [Testing Library](https://testing-library.com/) | Component testing utilities | ^16.3.2 |

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests once
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage report
bun run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests (headless)
bun run test:e2e

# Run E2E tests in headed mode (see browser)
bun run test:e2e:headed

# Run E2E tests with UI mode
bun run test:e2e:ui

# Run E2E tests in debug mode
bun run test:e2e:debug
```

### All Tests

```bash
# Run both unit and E2E tests
bun run test:all
```

### Code Quality

```bash
# Run linter
bun run lint

# Fix linting issues
bun run check

# Type check only
bunx tsc --noEmit
```

---

## Test Structure

```
tests/
├── e2e/                    # E2E tests (Playwright)
│   ├── landing.spec.ts     # Landing page tests
│   ├── login.spec.ts       # Login flow tests
│   ├── register.spec.ts    # Registration flow tests
│   ├── auth.spec.ts        # Authentication tests
│   ├── navigation.spec.ts  # Navigation tests
│   └── public-pages.spec.ts # Public pages tests
├── unit/                   # Unit tests (Vitest)
│   ├── setup.ts           # Test setup file
│   ├── components/        # Component tests
│   │   └── ui/            # UI component tests
│   │       └── button.test.tsx
│   └── lib/               # Library tests
│       ├── utils.test.ts
│       └── api.test.ts
├── fixtures/              # Playwright fixtures
│   ├── auth.fixture.ts    # Authenticated page fixture
│   └── test-users.json    # Test user credentials
├── helpers/               # Test helper functions
│   ├── auth.helper.ts     # Authentication helpers
│   ├── navigation.helper.ts # Navigation helpers
│   └── component.helper.ts # Component helpers
├── mocks/                 # API mocks
│   └── handlers.ts        # MSW handlers
└── types.ts               # Shared test types
```

---

## Writing Tests

### Unit Tests with Vitest

Unit tests should be fast, isolated, and focused on a single piece of functionality.

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("should render with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("should handle click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests with Playwright

E2E tests should cover user flows and integrations.

```tsx
import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("should login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "invalid@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});
```

### Using Helpers

Helpers are available for common testing tasks:

```tsx
import { loginAsUser, logoutUser } from "@/tests/helpers/auth.helper";
import { navigateToDashboard, waitForToast } from "@/tests/helpers/component.helper";

test("authenticated user flow", async ({ page }) => {
  await loginAsUser(page);
  await navigateToDashboard(page);
  await waitForToast(page);
});
```

### Using Fixtures

Use fixtures for pre-configured test states:

```tsx
import { test } from "@/tests/fixtures/auth.fixture";

test("test with authenticated user", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/dashboard");
  // User is already authenticated!
});
```

---

## CI/CD Pipeline

The QA pipeline (`.github/workflows/qa.yml`) runs on:

- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

### Pipeline Stages

1. **Code Quality**
   - Biome linter
   - Biome format check
   - TypeScript type check

2. **Unit Tests**
   - Run all Vitest tests with coverage
   - Upload coverage to Codecov
   - Check coverage thresholds (50% minimum)

3. **E2E Tests**
   - Parallel execution across 4 shards
   - All browsers: Chromium, Firefox, WebKit
   - Mobile viewports included

4. **Visual Tests** (PRs only)
   - Visual regression tests on Chromium

5. **Security Scan**
   - npm audit for vulnerabilities

6. **Performance Budget** (PRs only)
   - Bundle size checks

### Coverage Thresholds

| Metric | Threshold |
|--------|-----------|
| Statements | 50% |
| Branches | 50% |
| Functions | 50% |
| Lines | 50% |

---

## Best Practices

### General

1. **Test behavior, not implementation** - Focus on what the user sees
2. **Keep tests independent** - Each test should work in isolation
3. **Use descriptive names** - Test names should describe what is being tested
4. **Follow AAA pattern** - Arrange, Act, Assert

### Unit Tests

1. **Mock external dependencies** - Use `vi.mock()` for modules
2. **Test edge cases** - Cover error cases and boundaries
3. **Keep tests fast** - Avoid unnecessary setup/teardown

### E2E Tests

1. **Use data-testid attributes** - More stable than CSS selectors
2. **Wait for elements properly** - Use `waitFor()` and `waitForSelector()`
3. **Clean up after tests** - Clear localStorage, cookies, etc.
4. **Use page objects** - Encapsulate page-specific logic

### Test Data

1. **Use factories** - Create test data programmatically
2. **Be specific** - Use exact values, not "any" or "unknown"
3. **Clean up** - Remove test data after tests

---

## Troubleshooting

### Tests failing locally but passing in CI

- Check environment variables
- Verify API endpoints are accessible
- Ensure test users exist

### Flaky E2E tests

- Increase wait times
- Use more specific selectors
- Check for race conditions

### Coverage not reporting

- Ensure `vitest.config.ts` is correct
- Check that test files match the pattern
- Verify `@vitest/coverage-v8` is installed

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Biome Documentation](https://biomejs.dev/)
