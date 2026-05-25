import { z } from "zod";

export const completeRegistrationSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(50, "Username must be 50 characters or fewer."),

    password: z
      .string()
      .min(1, "Password is required.") //slet det her min-krav og ind-kommenter nedenstående
      /*.min(12, "Password must be at least 12 characters.")
      .max(128, "Password must be 128 characters or fewer.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.")*/,

    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    }
  );