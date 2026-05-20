import express from "express";
import { activateRegistration, showRegistrationPage, completeRegistration, } from "../controllers/registrations.js";
import { requirePendingRegistrationSession, } from "../middleware/requirePendingRegistrationSession.js";
import { validateCompleteRegistration, } from "../middleware/validateCompleteRegistration.js";
import { requireCsrfToken, } from "../middleware/requireCsrfToken.js";
import { deleteCsrfToken } from "../middleware/deleteCsrfToken.js";


const router = express.Router();

//Brugeren åbner linket fra emailen: /register/activate?token=...
router.get("/activate", activateRegistration);

//Selve registreringssiden
router.get("/", requirePendingRegistrationSession, showRegistrationPage );
//Man må også kun rent faktisk oprette sig hvis man 
router.post("/", requirePendingRegistrationSession, requireCsrfToken, validateCompleteRegistration, completeRegistration );


export default router;