import Joi from "joi";

import { AMOUNT_MAX_ERROR_MESSAGE, MAX_MONEY_AMOUNT } from "../constants/money.js";

export const moneyAmountSchema = Joi.number()
  .positive()
  .precision(2)
  .max(MAX_MONEY_AMOUNT)
  .messages({
    "number.max": AMOUNT_MAX_ERROR_MESSAGE,
  });

export const optionalMoneyAmountSchema = moneyAmountSchema;
