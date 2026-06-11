import { describe, expect, it } from "vitest";

import { financeRecordSchema } from "./finance";

describe("financeRecordSchema", () => {
  it("accepts valid finance input", async () => {
    await expect(
      financeRecordSchema.validate({
        name: "Concrete",
        amount: 1500.5,
      }),
    ).resolves.toEqual({
      name: "Concrete",
      amount: 1500.5,
    });
  });

  it("rejects non-positive amounts", async () => {
    await expect(
      financeRecordSchema.validate({
        name: "Concrete",
        amount: 0,
      }),
    ).rejects.toThrow("Amount must be greater than zero");
  });

  it("rejects empty names", async () => {
    await expect(
      financeRecordSchema.validate({
        name: "",
        amount: 100,
      }),
    ).rejects.toThrow("Name is required");
  });
});
