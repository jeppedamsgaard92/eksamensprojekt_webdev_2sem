import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";
import { deleteUser } from "../controllers/clients.js";
import { requireCsrfToken } from "../middleware/requireCsrfToken.js";

const router = express.Router();

router.delete('/:userId', requireAuth, requireCsrfToken, requirePermission('do-admin-stuff'), deleteUser);

export default router;