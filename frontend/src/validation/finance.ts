import * as yup from "yup";

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
    .required("Amount is required"),
});

export type FinanceRecordFormValues = yup.InferType<typeof financeRecordSchema>;
