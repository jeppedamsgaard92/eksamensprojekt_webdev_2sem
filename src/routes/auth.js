import express from "express";
import {login, getCurrentUser, logout,} from "../controllers/auth.js";
import { validateLogin } from "../middleware/validateLogin.js";
import { requireCsrfToken } from "../middleware/requireCsrfToken.js";
import { requireAuth } from "../middleware/requireAuth.js";


const router = express.Router();

router.post("/login", requireCsrfToken, validateLogin, login);

router.get("/me", requireAuth, getCurrentUser);

router.post("/logout", requireCsrfToken, requireAuth, logout);

export default router;