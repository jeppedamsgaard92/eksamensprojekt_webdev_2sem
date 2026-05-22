import express from 'express';
import { getSurveyQuestions, uploadAnsweredSurvey, uploadSurveyFile, getUnlinkedAnsweredSurveys } from '../controllers/survey.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requirePermission } from '../middleware/requirePermission.js';



const router = express.Router();

router.post('/new-survey', /* erLoggetInd, erAdmin */ uploadSurveyFile);

router.get('/survey-questions', getSurveyQuestions);

router.post('/survey-answers', uploadAnsweredSurvey);

router.get(
  "/answered-surveys",
  /*requireAuth,
  requirePermission("create:client-account"),*/
  getUnlinkedAnsweredSurveys
);

export default router;