import express from 'express';
import { getSurveyQuestions, uploadAnsweredSurvey, uploadSurveyFile } from '../controllers/survey.js';




const router = express.Router();

router.post('/new-survey', /* erLoggetInd, erAdmin */ uploadSurveyFile);

router.get('/survey-questions', getSurveyQuestions);

router.post('/survey-answers', uploadAnsweredSurvey);

router.get(
  "/available-answered-surveys",
  requireAuth,
  requirePermission("create:client-account"),
  getAvailableAnsweredSurveys
);

export default router;