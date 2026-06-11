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

  it("accepts the maximum allowed amount", async () => {
    await expect(
      financeRecordSchema.validate({
        name: "Concrete",
        amount: 99999999.99,
      }),
    ).resolves.toEqual({
      name: "Concrete",
      amount: 99999999.99,
    });
  });

  it("rejects amounts above the maximum", async () => {
    await expect(
      financeRecordSchema.validate({
        name: "Concrete",
        amount: 100000000,
      }),
    ).rejects.toThrow("Amount must be less than or equal to 99,999,999.99");
  });
});
