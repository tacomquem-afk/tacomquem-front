import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

/**
 * Unit tests for lib/utils.ts
 */

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should handle undefined and null", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("should handle empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("should merge Tailwind classes correctly (later classes win)", () => {
    // twMerge resolves Tailwind conflicts - later classes override earlier ones
    expect(cn("p-4 p-2")).toBe("p-2");
    expect(cn("text-sm text-lg")).toBe("text-lg");
  });

  it("should handle complex conditional logic", () => {
    const isActive = true;
    const isDisabled = false;

    expect(
      cn("base-class", isActive && "active", isDisabled && "disabled")
    ).toBe("base-class active");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("should handle objects with boolean values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("should combine all input types", () => {
    expect(
      cn("base", { active: true, disabled: false }, ["extra", "classes"])
    ).toBe("base active extra classes");
  });

  it("should handle empty input", () => {
    expect(cn()).toBe("");
  });

  it("should not have duplicate Tailwind classes when resolved", () => {
    // twMerge removes conflicting Tailwind classes
    expect(cn("bg-red-500 bg-blue-500")).toBe("bg-blue-500");
  });
});
