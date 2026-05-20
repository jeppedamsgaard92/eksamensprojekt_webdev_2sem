import express from "express";
import { activateRegistration, showRegistrationPage, completeRegistration, } from "../controllers/registrations.js";
import { requirePendingRegistrationSession, } from "../middleware/requirePendingRegistrationSession.js";
import { validateCompleteRegistration, } from "../middleware/validateCompleteRegistration.js";
import { requireCsrfToken, } from "../middleware/requireCsrfToken.js";
import { generateCsrfToken, hashToken, } from "../utils/tokens.js";

const router = express.Router();

//Brugeren åbner linket fra emailen: /register/activate?token=...
router.get("/activate", activateRegistration);

//Selve registreringssiden må kun ses, hvis aktiveringslinket/token først er verificeret - selvfølgelig.
router.get("/", requirePendingRegistrationSession, showRegistrationPage );
//Man må også kun rent faktisk oprette sig hvis man 
router.post("/", requirePendingRegistrationSession, requireCsrfToken, validateCompleteRegistration, completeRegistration );

router.get("/csrf-token", requirePendingRegistrationSession,
  (req, res) => {
    const csrfToken = generateCsrfToken();
    req.session.csrfTokenHash = hashToken(csrfToken);
    res.status(200).json({
      csrfToken,
    });
  }
);

export default router;