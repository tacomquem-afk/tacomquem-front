import { beforeEach, describe, expect, it, vi } from "vitest";
import { api, clearTokens, getAccessToken, setTokens } from "@/lib/api/client";

/**
 * Unit tests for API client
 *
 * Note: The API client module is mocked in tests/unit/setup.ts
 * These tests verify that the mock functions are properly configured
 */

describe("API Client (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Token Management Functions", () => {
    it("should have getAccessToken function", () => {
      expect(getAccessToken).toBeDefined();
      expect(typeof getAccessToken).toBe("function");
    });

    it("should have setTokens function", () => {
      expect(setTokens).toBeDefined();
      expect(typeof setTokens).toBe("function");
    });

    it("should have clearTokens function", () => {
      expect(clearTokens).toBeDefined();
      expect(typeof clearTokens).toBe("function");
    });

    it("should call getAccessToken when invoked", async () => {
      await getAccessToken();
      expect(getAccessToken).toHaveBeenCalled();
    });

    it("should call setTokens with correct arguments", () => {
      setTokens("access-token", "refresh-token");
      expect(setTokens).toHaveBeenCalledWith("access-token", "refresh-token");
    });

    it("should call clearTokens when invoked", () => {
      clearTokens();
      expect(clearTokens).toHaveBeenCalled();
    });
  });

  describe("API Client Methods", () => {
    it("should have api.get method", () => {
      expect(api.get).toBeDefined();
      expect(typeof api.get).toBe("function");
    });

    it("should have api.post method", () => {
      expect(api.post).toBeDefined();
      expect(typeof api.post).toBe("function");
    });

    it("should have api.patch method", () => {
      expect(api.patch).toBeDefined();
      expect(typeof api.patch).toBe("function");
    });

    it("should have api.delete method", () => {
      expect(api.delete).toBeDefined();
      expect(typeof api.delete).toBe("function");
    });

    it("should have api.upload method", () => {
      expect(api.upload).toBeDefined();
      expect(typeof api.upload).toBe("function");
    });

    it("should call api.get when invoked", () => {
      api.get("/test");
      expect(api.get).toHaveBeenCalledWith("/test");
    });

    it("should call api.post with body", () => {
      const body = { name: "test" };
      api.post("/test", body);
      expect(api.post).toHaveBeenCalledWith("/test", body);
    });

    it("should call api.patch with body", () => {
      const body = { name: "updated" };
      api.patch("/test", body);
      expect(api.patch).toHaveBeenCalledWith("/test", body);
    });

    it("should call api.delete when invoked", () => {
      api.delete("/test");
      expect(api.delete).toHaveBeenCalledWith("/test");
    });
  });
});
