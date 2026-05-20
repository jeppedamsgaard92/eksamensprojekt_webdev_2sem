import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllPdfFiles, uploadPdfFiles } from '../controllers/onboarding.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Avanceret opsætning af Multer til at beholde originalt navn og overskrive
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/pdfSlidesDB/'));
    },
    filename: function (req, file, cb) {
        // cb(null, ...) bestemmer navnet på harddisken. 
        // Ved at bruge originalname beholder den navnet, og Node overskriver automatisk hvis den findes i forvejen!
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// ROUTES
router.post('/pdf-slides', /* LoggetInd, requireAdmin */ upload.array('files'), uploadPdfFiles);

router.get('/pdf-slides', /* LoggetInd, requireAdmin */ getAllPdfFiles)

export default router;

