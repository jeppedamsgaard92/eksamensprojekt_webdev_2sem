import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllPdfFiles, uploadPdfFiles, sendOnboardingInvitation, uploadYoutubeLinks, getSavedYoutubeLinks, createOnboardingCourse, updateOnboardingProgress, deleteOnboardingCourse, deleteYoutubeLink } from '../controllers/onboarding.js';
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

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
const router = express.Router();

// ROUTES
router.post('/pdf-slides', requireAuth, requirePermission('do-admin-stuff'), requireCsrfToken, upload.array('files'), uploadPdfFiles);

router.get('/pdf-slides', requireAuth, requirePermission('do-admin-stuff'), getAllPdfFiles);

router.post('/youtube-links', requireAuth, requirePermission('do-admin-stuff'), requireCsrfToken, uploadYoutubeLinks);

router.get('/youtube-links', requireAuth, requirePermission('do-admin-stuff'), getSavedYoutubeLinks);

router.delete('/youtube-link/:linkId', requireAuth, requirePermission('do-admin-stuff'), deleteYoutubeLink)

// Til at poste onboarding til specifik bruger
router.post("/:userId/onboarding", requireAuth, requirePermission("account:send-onboarding-and-invitation"), requireCsrfToken, createOnboardingCourse);

//til at sende invitation til at registere sig
router.post('/send-register-invitation/:userId', requireAuth, requirePermission("account:send-onboarding-and-invitation"), requireCsrfToken, sendOnboardingInvitation)

//til at få sin tilknyttede onboarding vist
router.get("/", requireAuth, getLinkedOnboardingCourse);

// Til at poste sin onboardig progress som klient
router.post('/onboarding-progress', requireAuth, requirePermission('do-client-stuff'), requireCsrfToken, updateOnboardingProgress);

// Til at slette et onboarding kursus for en specifik klient
router.delete('/:clientId/onboarding', requireAuth, requirePermission('do-admin-stuff'), requireCsrfToken, deleteOnboardingCourse)

export default router;

