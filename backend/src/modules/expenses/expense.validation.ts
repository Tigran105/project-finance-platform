import Joi from "joi";

import { moneyAmountSchema, optionalMoneyAmountSchema } from "../../common/validation/money-amount.js";

export const createExpenseSchema = Joi.object({
  projectId: Joi.string().required(),
  name: Joi.string().trim().min(1).max(150).required(),
  amount: moneyAmountSchema.required(),
});

export const updateExpenseSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).optional(),
  amount: optionalMoneyAmountSchema.optional(),
}).min(1);
