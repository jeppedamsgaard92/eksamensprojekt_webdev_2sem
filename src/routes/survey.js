import express from 'express';
import { getSurveyQuestions, uploadAnsweredSurvey, uploadSurveyFile, getUnlinkedAnsweredSurveys, deleteAnsweredSurvey } from '../controllers/survey.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { requireCsrfToken } from '../middleware/requireCsrfToken.js';
import { surveyAnswerLimiter } from '../middleware/rateLimiters.js';


const router = express.Router();

router.post('/new-survey', requireAuth, requirePermission('do-admin-stuff'), requireCsrfToken, uploadSurveyFile);

router.get('/survey-questions', getSurveyQuestions);

router.post('/survey-answers', surveyAnswerLimiter, uploadAnsweredSurvey);

router.get("/answered-surveys", requireAuth, requirePermission('do-admin-stuff'), getUnlinkedAnsweredSurveys);

router.delete('/answered-survey/:surveyId', requireAuth, requirePermission('do-admin-stuff'), requireCsrfToken, deleteAnsweredSurvey);

export default router;