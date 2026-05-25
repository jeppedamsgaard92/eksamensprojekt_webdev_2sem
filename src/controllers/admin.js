import crypto from "crypto";
import { auditLog } from "../utils/auditLogger.js";

import {
  createPendingUserAccount,
} from "../services/invitations.js";

import {
  findAnsweredSurveyById,
  updateAnsweredSurveyById,
} from "../dataUtils/surveys.js";

export async function createNewClientAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;
    const { id } = req.params;

    if (id) {
      // Tjekker at survey-id'et faktisk findes.
      const survey = await findAnsweredSurveyById(id);

      if (!survey) {
        return res.status(400).json({
          message: "Invalid survey id. Der findes ikke en survey med dette id.",
        });
      }

      // Samme survey må kun bruges én gang.
      if (survey.hasRegisteredClient) {
        return res.status(409).json({
          message: "A client has already been registered from this survey.",
        });
      }
    }

    // Client får samme id som surveyen.
    const user = await createPendingUserAccount({
      id: id ?? crypto.randomUUID(),
      name,
      email,
      role: "client",
    });

    // Markerer survey'en som brugt hvis der kom et survey-id med i params
    if (id) {
      // Survey markeres som brugt.
      await updateAnsweredSurveyById(id, {
        hasRegisteredClient: true,
      });
    }

    await auditLog({
      action: "CREATE_CLIENT_ACCOUNT",
      actorUserId: req.session.user.id,
      targetUserId: user.id,
      targetRole: user.role,
    });

    res.status(201).json({
      message: "Client account created.",
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      registrationCompleted: user.registrationCompleted,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewAdminAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;

    // Admin er ikke koblet til survey.
    const user = await createPendingUserAccount({
      id: crypto.randomUUID(),
      name,
      email,
      role: "admin",
    });

    await auditLog({
      action: "CREATE_ADMIN_ACCOUNT",
      actorUserId: req.session.user.id,
      targetUserId: user.id,
      targetRole: user.role,
    });

    res.status(201).json({
      message: "Admin account created.",
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      registrationCompleted: user.registrationCompleted,
    });
  } catch (error) {
    next(error);
  }
}