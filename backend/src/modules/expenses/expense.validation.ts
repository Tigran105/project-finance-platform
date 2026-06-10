import Joi from "joi";

export const createExpenseSchema = Joi.object({
  projectId: Joi.string().required(),
  name: Joi.string().trim().min(1).max(150).required(),
  amount: Joi.number().positive().precision(2).required(),
});

export const updateExpenseSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).optional(),
  amount: Joi.number().positive().precision(2).optional(),
}).min(1);
