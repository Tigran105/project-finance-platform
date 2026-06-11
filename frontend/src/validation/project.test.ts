import { describe, expect, it } from "vitest";

import { createProjectSchema, inviteUserSchema } from "./project";

describe("createProjectSchema", () => {
  it("accepts valid project input", async () => {
    await expect(
      createProjectSchema.validate({
        name: "Office Renovation",
        location: "Tbilisi",
      }),
    ).resolves.toEqual({
      name: "Office Renovation",
      location: "Tbilisi",
    });
  });

  it("rejects project names that are too short", async () => {
    await expect(
      createProjectSchema.validate({
        name: "A",
        location: "Tbilisi",
      }),
    ).rejects.toThrow("Name must be at least 2 characters");
  });
});

describe("inviteUserSchema", () => {
  it("accepts a valid email", async () => {
    await expect(
      inviteUserSchema.validate({
        email: "member@example.com",
      }),
    ).resolves.toEqual({
      email: "member@example.com",
    });
  });

  it("rejects an invalid email", async () => {
    await expect(
      inviteUserSchema.validate({
        email: "invalid",
      }),
    ).rejects.toThrow("Enter a valid email address");
  });
});
