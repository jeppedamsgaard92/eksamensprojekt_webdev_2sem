import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireCsrfToken } from "../middleware/requireCsrfToken.js";
import { deleteOwnAccount, updateOwnAccount } from "../controllers/account.js";
import { validateUpdateOwnAccount } from "../middleware/validateUpdateOwnAccount.js";
import { requireReauthentication } from "../middleware/requireReauthentication.js";
import { updateOwnPassword } from "../controllers/account.js";
import { validateUpdateOwnPassword } from "../middleware/validateUpdateOwnPassword.js";

const router = express.Router();

router.delete("/me", requireAuth, requireCsrfToken, requireReauthentication, deleteOwnAccount);

router.patch("/me", requireAuth, requireCsrfToken, requireReauthentication, validateUpdateOwnAccount, updateOwnAccount);

router.patch("/me/password", requireAuth, requireCsrfToken, validateUpdateOwnPassword, requireReauthentication, updateOwnPassword);

export default router;