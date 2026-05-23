import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllPdfFiles, uploadPdfFiles, sendOnboardingInvitation, uploadYoutubeLinks, getSavedYoutubeLinks, createOnboardingCourse } from '../controllers/onboarding.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { requireCsrfToken } from '../middleware/requireCsrfToken.js';
import { getLinkedOnboardingCourse } from '../controllers/onboarding.js';

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

// Til at poste onboarding til specifik bruger
router.post("/:userId/onboarding", requireAuth, requirePermission("account:send-onboarding-and-invitation"), requireCsrfToken, createOnboardingCourse);

//til at sende invitation til at registere sig
router.post('/send-register-invitation/:userId', requireAuth, requirePermission("account:send-onboarding-and-invitation"), requireCsrfToken, sendOnboardingInvitation)

//til at få sin tilknyttede onboarding vist
router.get("/", requireAuth, getLinkedOnboardingCourse);


export default router;

