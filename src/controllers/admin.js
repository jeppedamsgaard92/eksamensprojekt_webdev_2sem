import { createUserInvitation } from "../services/invitations.js";

export async function createNewClientAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;

    const { user, registrationLink } = await createUserInvitation({
      name,
      email,
      role: "client",
    });

    res.status(201).json({
      message: "Client account invitation created.",
      user,
      registrationLink,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewAdminAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;

    const { user, registrationLink } = await createUserInvitation({
      name,
      email,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin account invitation created.",
      user,
      registrationLink,
    });
  } catch (error) {
    next(error);
  }
}