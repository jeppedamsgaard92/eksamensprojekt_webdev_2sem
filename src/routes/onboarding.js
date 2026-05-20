import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadPdfFiles } from '../controllers/onboarding.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Den gemmer filerne i: data/pdfSlidesDB/-mappe
const upload = multer({ dest: path.join(__dirname, '../../data/pdfSlidesDB/') });

const router = express.Router();

router.post('/pdf-slides', /* LoggetInd, requireAdmin */ upload.array('files'), uploadPdfFiles);

export default router;

