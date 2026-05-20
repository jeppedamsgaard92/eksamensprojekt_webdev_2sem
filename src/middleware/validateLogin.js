import { loginSchema } from "../schemas/login.js";

export function validateLogin(req, res, next) {
  // Kun valideret login-data får lov at gå videre.
  const result = loginSchema.safeParse(req.body); // Hvis data er ugyldig, returnerer safeParse et resultat-objekt - ikke en error.

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid login data.",
      errors: result.error.flatten().fieldErrors, //flatten gør fejlene nemmere at læse for frontend - ellers er det en masse nested arrays og objekter.
    });
  }

  req.validatedData = result.data;

  next();
}