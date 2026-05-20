import express from 'express';
import { uploadPdfFiles } from '../controllers/onboarding.js';

const router = express.Router();

router.post('/pdf-slides', /* LoggetInd, requireAdmin */ uploadPdfFiles);

export default router;

