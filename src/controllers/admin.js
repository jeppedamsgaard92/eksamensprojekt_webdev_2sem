import {
  createPendingUserAccount,
} from "../services/invitations.js";

import {
  findAnsweredSurveyById,
  updateAnsweredSurveyById,
} from "../dataUtils/surveys.js";

import crypto from "crypto";

export async function createNewClientAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;
    const { id } = req.params;

    const survey =
      await findAnsweredSurveyById(id);

    // Survey-id skal eksistere.
    if (!survey) {
      return res.status(400).json({
        message: "Invalid survey id.",
      });
    }

    // Man må ikke oprette flere clients ud fra samme survey.
    if (survey.hasRegisteredClient) {
      return res.status(409).json({
        message:
          "A client has already been registered from this survey.",
      });
    }

    const user = await createPendingUserAccount({
      id,
      name,
      email,
      role: "client",
    });

    // Marker survey som brugt.
    await updateAnsweredSurveyById(id, {
      hasRegisteredClient: true,
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
      id: crypto.randomUUID(),
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