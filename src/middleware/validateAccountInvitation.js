import { accountInvitationSchema } from "../schemas/accountInvitation.js";

export function validateAccountInvitation(req, res, next) {
  // Validerer name + email fra admin-formularen/frontend.
  const result = accountInvitationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid account invitation data.",
      errors: result.error.flatten().fieldErrors,
    });
  }

  // Controlleren får kun den validerede data.
  req.validatedData = result.data;

  next();
}