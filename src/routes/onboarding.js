import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllPdfFiles, uploadPdfFiles, sendOnboardingInvitation, uploadYoutubeLinks, getSavedYoutubeLinks, createOnboardingCourse } from '../controllers/onboarding.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { requireCsrfToken } from '../middleware/requireCsrfToken.js';

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

router.get('/pdf-slides', /* LoggetInd, requireAdmin */ getAllPdfFiles);

router.post('/youtube-links', /* requireAuth, requirePermission("upload-youtube-links") */ uploadYoutubeLinks);

router.get('/youtube-links', /* requireAuth, requirePermission("get-youtube-links") */ getSavedYoutubeLinks);

//til at sende invitation til onboarding
router.post("/:userId/onboarding", /* requireAuth, requirePermission("account:send-onboarding-invitation"), requireCsrfToken, */ createOnboardingCourse, sendOnboardingInvitation);

export default router;

