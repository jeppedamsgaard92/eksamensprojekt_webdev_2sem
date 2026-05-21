import express from 'express';
import { getSurveyQuestions, uploadSurveyFile } from '../controllers/survey.js';

const router = express.Router();

router.post('/new-survey', uploadSurveyFile);

router.get('/survey-questions', /* erLoggetInd, erAdmin */ getSurveyQuestions)

export default router;