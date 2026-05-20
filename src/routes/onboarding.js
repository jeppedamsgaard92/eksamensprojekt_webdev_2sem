import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadPdfFiles } from '../controllers/onboarding.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Avanceret opsætning af Multer til at beholde originalt navn og overskrive
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../data/pdfSlidesDB/'));
    },
    filename: function (req, file, cb) {
        // cb(null, ...) bestemmer navnet på harddisken. 
        // Ved at bruge originalname beholder den navnet, og Node overskriver automatisk hvis den findes i forvejen!
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/pdf-slides', /* LoggetInd, requireAdmin */ upload.array('files'), uploadPdfFiles);

router

export default router;

