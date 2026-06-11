import { createExpenseSchema, updateExpenseSchema } from "../modules/expenses/expense.validation.js";
import { createIncomeSchema, updateIncomeSchema } from "../modules/incomes/income.validation.js";
import { AMOUNT_MAX_ERROR_MESSAGE, MAX_MONEY_AMOUNT } from "../common/constants/money.js";

describe("Money amount validation", () => {
  it("accepts amounts up to the database maximum", () => {
    const input = {
      projectId: "project-1",
      name: "Materials",
      amount: MAX_MONEY_AMOUNT,
    };

    expect(createExpenseSchema.validate(input).error).toBeUndefined();
    expect(createIncomeSchema.validate(input).error).toBeUndefined();
  });

  it("rejects expense amounts above the database maximum", () => {
    const { error } = createExpenseSchema.validate({
      projectId: "project-1",
      name: "Materials",
      amount: 100000000,
    });

    expect(error?.message).toBe(AMOUNT_MAX_ERROR_MESSAGE);
  });

  it("rejects income amounts above the database maximum", () => {
    const { error } = createIncomeSchema.validate({
      projectId: "project-1",
      name: "Grant",
      amount: 55555555555,
    });

    expect(error?.message).toBe(AMOUNT_MAX_ERROR_MESSAGE);
  });

  it("rejects update amounts above the database maximum", () => {
    const expenseError = updateExpenseSchema.validate({ amount: 100000000 }).error;
    const incomeError = updateIncomeSchema.validate({ amount: 100000000 }).error;

    expect(expenseError?.message).toBe(AMOUNT_MAX_ERROR_MESSAGE);
    expect(incomeError?.message).toBe(AMOUNT_MAX_ERROR_MESSAGE);
  });
});
