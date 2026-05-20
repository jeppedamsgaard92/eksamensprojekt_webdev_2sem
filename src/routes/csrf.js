import express from "express";
import { generateCsrfToken, hashToken } from "../utils/tokens.js";

const router = express.Router();

router.get("/", (req, res) => {
  const csrfToken = generateCsrfToken();

  req.session.csrfTokenHash = hashToken(csrfToken);

  res.status(200).json({ csrfToken });
});

export default router;