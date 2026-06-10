import Joi from "joi";

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  location: Joi.string().trim().min(2).max(150).required(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).optional(),
  location: Joi.string().trim().min(2).max(150).optional(),
}).min(1);
