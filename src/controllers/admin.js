import {
  createPendingUserAccount,
} from "../services/invitations.js";

export async function createNewClientAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;

    const user = await createPendingUserAccount({
      name,
      email,
      role: "client",
    });

    res.status(201).json({
      message: "Client account created.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewAdminAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;

    const user = await createPendingUserAccount({
      name,
      email,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin account created.",
      user,
    });
  } catch (error) {
    next(error);
  }
}