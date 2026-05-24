import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";
import { deleteUser, getAllClients, getSpecificClient } from "../controllers/clients.js";
import { requireCsrfToken } from "../middleware/requireCsrfToken.js";

const router = express.Router();

router.get('/all-clients', requireAuth, requirePermission('do-admin-stuff'), getAllClients);

router.get('/client-info/:clientId', requireAuth, requirePermission('do-admin-stuff'), getSpecificClient);

router.delete('/:userId', requireAuth, requireCsrfToken, requirePermission('do-admin-stuff'), deleteUser);

export default router;