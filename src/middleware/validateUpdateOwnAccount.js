import { updateOwnAccountSchema } from "../schemas/account.js";

export function validateUpdateOwnAccount(req, res, next) {
  const result = updateOwnAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid account data.",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.validatedData = result.data;

  next();
}