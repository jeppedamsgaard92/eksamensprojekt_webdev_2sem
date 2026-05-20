import { z } from "zod";

export const accountInvitationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be 100 characters or fewer."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email must be valid."),
});