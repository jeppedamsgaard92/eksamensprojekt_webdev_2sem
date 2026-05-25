import express from "express";
import { activateRegistration, showRegistrationPage, completeRegistration, } from "../controllers/registrations.js";
import { requirePendingRegistrationSession, } from "../middleware/requirePendingRegistrationSession.js";
import { validateCompleteRegistration, } from "../middleware/validateCompleteRegistration.js";
import { requireCsrfToken, } from "../middleware/requireCsrfToken.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";
import { validateAccountCreation } from "../middleware/validateAccountCreation.js";
import { createNewClientAccount, createNewAdminAccount } from "../controllers/admin.js";


const router = express.Router();

//Brugeren åbner linket fra emailen: /register/activate?token=...
router.get("/activate", activateRegistration);

//Selve registreringssiden
router.get("/", requirePendingRegistrationSession, showRegistrationPage);
//Man må også kun rent faktisk oprette sig hvis man 
router.post("/", requirePendingRegistrationSession, requireCsrfToken, validateCompleteRegistration, completeRegistration);


// admin til at oprette klient og admin accounts
router.post(
  "/create-new-client-account/:id?",
  requireAuth,
  requirePermission("create:client-account"),
  requireCsrfToken,
  validateAccountCreation,
  createNewClientAccount
);

router.post(
  "/create-new-admin-account",
  requireAuth,
  requirePermission("create:admin-account"),
  requireCsrfToken,
  validateAccountCreation,
  createNewAdminAccount
);

export default router;