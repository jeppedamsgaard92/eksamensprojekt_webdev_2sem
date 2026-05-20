import { loginSchema } from "../schemas/login.js";

export function validateLogin(req, res, next) {
  // Kun valideret login-data får lov at gå videre.
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid login data.",
      errors: result.error.flatten().fieldErrors,
    });
  }

  // Controlleren skal bruge den rensede/validerede data.
  req.validatedData = result.data;

  next();
}