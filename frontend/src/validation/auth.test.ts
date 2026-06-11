import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "./auth";

describe("loginSchema", () => {
  it("accepts valid credentials", async () => {
    await expect(
      loginSchema.validate({
        email: "user@example.com",
        password: "secret",
      }),
    ).resolves.toEqual({
      email: "user@example.com",
      password: "secret",
    });
  });

  it("rejects an invalid email", async () => {
    await expect(
      loginSchema.validate({
        email: "not-an-email",
        password: "secret",
      }),
    ).rejects.toThrow("Enter a valid email address");
  });

  it("requires a password", async () => {
    await expect(
      loginSchema.validate({
        email: "user@example.com",
        password: "",
      }),
    ).rejects.toThrow("Password is required");
  });
});

describe("registerSchema", () => {
  it("accepts valid registration input", async () => {
    await expect(
      registerSchema.validate({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "123456",
      }),
    ).resolves.toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "123456",
    });
  });

  it("rejects passwords shorter than 6 characters", async () => {
    await expect(
      registerSchema.validate({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "12345",
      }),
    ).rejects.toThrow("Password must be at least 6 characters");
  });

  it("rejects names shorter than 2 characters", async () => {
    await expect(
      registerSchema.validate({
        name: "J",
        email: "jane@example.com",
        password: "123456",
      }),
    ).rejects.toThrow("Name must be at least 2 characters");
  });
});
