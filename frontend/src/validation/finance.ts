import * as yup from "yup";

import { AMOUNT_MAX_ERROR_MESSAGE, MAX_MONEY_AMOUNT } from "@/constants/money";

export const financeRecordSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(1, "Name is required")
    .max(150, "Name must be at most 150 characters")
    .required("Name is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .max(MAX_MONEY_AMOUNT, AMOUNT_MAX_ERROR_MESSAGE)
    .test(
      "max-decimals",
      "Amount can have at most 2 decimal places",
      (value) =>
        value === undefined ||
        value === null ||
        Number.isNaN(value) ||
        Math.round(value * 100) / 100 === value,
    )
    .required("Amount is required"),
});

export type FinanceRecordFormValues = yup.InferType<typeof financeRecordSchema>;
