import express from 'express';
import { uploadPdfFiles } from '../controllers/onboarding';

const router = express.Router();

router.post('/pdf-slides', /* LoggetInd, requireAdmin */ uploadPdfFiles(files));

export default router;

