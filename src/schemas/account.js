import { z } from "zod";

export const updateOwnAccountSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(100, "Name must be 100 characters or fewer."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, "Email must be 254 characters or fewer.")
      .email("Email must be valid."),
  })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided.",
    }
  );

export const updateOwnPasswordSchema = z
  .object({
    username: z.string().trim().min(1).max(100),

    password: z.string().min(1).max(128),

    newPassword: z
      .string()
      .min(1, "New password is required.") //slet det her min-krav og ind-kommenter nedenstående
      /*.min(12, "New password must be at least 12 characters.")
      .max(128, "New password must be 128 characters or fewer.")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "New password must contain at least one number.")
      .regex(/[^a-zA-Z0-9]/, "New password must contain at least one special character.")*/,

    confirmNewPassword: z.string(),
  })
  .refine(({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "New passwords do not match.",
  })
  .refine(({ password, newPassword }) => password !== newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password.",
  });