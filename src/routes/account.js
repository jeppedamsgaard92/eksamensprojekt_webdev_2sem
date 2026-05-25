import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireCsrfToken } from "../middleware/requireCsrfToken.js";
import { deleteOwnAccount } from "../controllers/account.js";

const router = express.Router();

router.delete("/me", requireAuth, requireCsrfToken, deleteOwnAccount);

export default router;