import { describe, expect, it } from "vitest";

import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats positive amounts as USD currency", () => {
    const expected = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(1234.5);

    expect(formatCurrency(1234.5)).toBe(expected);
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toContain("0.00");
  });
});
