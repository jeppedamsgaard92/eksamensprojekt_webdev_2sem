import express from "express";

import {
  activateRegistration,
  showRegistrationPage,
  completeRegistration,
} from "../controllers/registrations.js";

import {
  requirePendingRegistrationSession,
} from "../middleware/requirePendingRegistrationSession.js";

import {
  validateCompleteRegistration,
} from "../middleware/validateCompleteRegistration.js";

import {
  requireCsrfToken,
} from "../middleware/requireCsrfToken.js";

const router = express.Router();

//Brugeren åbner linket fra emailen: /register/activate?token=...
router.get("/activate", activateRegistration);

//Selve registreringssiden må kun ses, hvis aktiveringslinket først er verificeret.
router.get(
  "/",
  requirePendingRegistrationSession,
  showRegistrationPage
);

router.post(
  "/",
  requirePendingRegistrationSession,
  requireCsrfToken,
  validateCompleteRegistration,
  completeRegistration
);

export default router;