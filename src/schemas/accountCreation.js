import { z } from "zod";

export const accountCreationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email must be valid."),
});