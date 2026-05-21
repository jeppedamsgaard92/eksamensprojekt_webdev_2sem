import { accountCreationSchema } from "../schemas/accountCreation.js";

export function validateAccountCreation(req, res, next) {
  const result = accountCreationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid account creation data.",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.validatedData = result.data;

  next();
}