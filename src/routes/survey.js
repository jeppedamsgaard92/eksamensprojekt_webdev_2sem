import express from 'express';
import { getSurveyQuestions, uploadAnsweredSurvey, uploadSurveyFile, getUnlinkedAnsweredSurveys } from '../controllers/survey.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requirePermission } from '../middleware/requirePermission.js';



const router = express.Router();

router.post('/new-survey', requireAuth, requirePermission('do-admin-stuff'), uploadSurveyFile);

router.get('/survey-questions', getSurveyQuestions);

router.post('/survey-answers', uploadAnsweredSurvey);

router.get("/answered-surveys", requireAuth, requirePermission('do-admin-stuff'), getUnlinkedAnsweredSurveys);

export default router;