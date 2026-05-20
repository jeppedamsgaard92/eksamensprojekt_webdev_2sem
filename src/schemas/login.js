import { z } from "zod";

export const loginSchema = z.object({
  // Username trimmes, fordi mellemrum før/efter er fejl.
  username: z
    .string()
    .trim()
    .min(1, "Username is required."),

  // Password trimmes ikke, fordi mellemrum kan være del af passwordet.
  password: z
    .string()
    .min(1, "Password is required."),
});