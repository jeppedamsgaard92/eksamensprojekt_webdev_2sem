import { z } from "zod";

//Validerer de loginoplysninger, brugeren sender fra registreringsformularen.
export const completeRegistrationSchema = z
  .object({
    //Brugernavn trimmes og holdes til et kontrolleret tegnsæt.
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(50, "Username must be 50 characters or fewer."),

    //Password trimmes ikke, fordi mellemrum kan være en bevidst del af passwordet.
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be 128 characters or fewer."),

    confirmPassword: z.string(),
  })

  //Tjekker, at brugeren har skrevet det samme password to gange.
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    }
  );