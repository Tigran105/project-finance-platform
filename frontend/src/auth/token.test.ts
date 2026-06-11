import { describe, expect, it } from "vitest";

import { clearAuthToken, getAuthToken, setAuthToken } from "./token";

describe("auth token storage", () => {
  it("stores and retrieves a token", () => {
    setAuthToken("abc123");
    expect(getAuthToken()).toBe("abc123");
  });

  it("clears a stored token", () => {
    setAuthToken("abc123");
    clearAuthToken();
    expect(getAuthToken()).toBeNull();
  });

  it("returns null when no token is stored", () => {
    expect(getAuthToken()).toBeNull();
  });
});
