import Joi from "joi";

export const inviteUserSchema = Joi.object({
  projectId: Joi.string().required(),
  email: Joi.string().trim().email().required(),
});
