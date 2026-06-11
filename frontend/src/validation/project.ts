import * as yup from "yup";

export const createProjectSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must be at most 150 characters")
    .required("Project name is required"),
  location: yup
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(150, "Location must be at most 150 characters")
    .required("Location is required"),
});

export const inviteUserSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export type CreateProjectFormValues = yup.InferType<typeof createProjectSchema>;
export type UpdateProjectFormValues = CreateProjectFormValues;
export type InviteUserFormValues = yup.InferType<typeof inviteUserSchema>;
