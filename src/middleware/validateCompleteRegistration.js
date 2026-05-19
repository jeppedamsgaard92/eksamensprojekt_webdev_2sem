import { completeRegistrationSchema } from "../schemas/registration.js";

//Validerer registreringsformularen, før controlleren får lov at gemme nye credentials.
export function validateCompleteRegistration(req, res, next) {
  const result = completeRegistrationSchema.safeParse(req.body);

  //Hvis input er ugyldigt, stopper requesten her.
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid registration data.",
      errors: result.error.flatten().fieldErrors,
    });
  }

  //Kun de validerede og transformerede data sendes videre i flowet.
  req.validatedData = result.data;

  next();
}