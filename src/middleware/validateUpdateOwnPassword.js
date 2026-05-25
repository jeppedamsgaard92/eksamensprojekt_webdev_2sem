import { updateOwnPasswordSchema } from "../schemas/account.js";

export function validateUpdateOwnPassword(req, res, next) {
  const result = updateOwnPasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid password update data.",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.validatedData = result.data;

  next();
}