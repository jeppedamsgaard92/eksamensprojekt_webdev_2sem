import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  createAnsweredSurvey,
  deleteSurveyById,
  getNewAnsweredSurveys,
} from "../dataUtils/surveys.js";

import {
  answeredSurvey,
  surveyQuestions,
} from "../schemas/survey.js";
import { success } from "zod";

// Finder korrekt sti fra denne fil.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sti til survey-spørgsmålene.
const pathToSurvey = path.join(
  __dirname,
  "../../data/survey/survey.json"
);

export async function uploadSurveyFile(req, res) {
  const validation = surveyQuestions.safeParse(req.body);

  // Survey-template skal være et array af tekststrenge.
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Dataen skal være et array, og må KUN indeholde tekststrenge!",
    });
  }

  try {
    // Gemmer ny survey-template.
    await fs.writeFile(
      pathToSurvey,
      JSON.stringify(validation.data, null, 4),
      "utf-8"
    );

    res.status(200).json({
      success: true,
      message: "Survey blev modtaget",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Kunne ikke gemme survey på server",
    });
  }
}

export async function getSurveyQuestions(req, res) {
  try {
    // Læser survey-template.
    const surveyFile = await fs.readFile(pathToSurvey, "utf-8");
    const questions = JSON.parse(surveyFile);

    res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Kunne ikke finde nogen survey på server",
    });
  }
}

export async function uploadAnsweredSurvey(req, res, next) {
  try {
    const validation = answeredSurvey.safeParse(req.body);

    // Besvarelsen skal være [{ question, answer }].
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dataen skal være et array med objekter i format {question: "", answer: ""}',
      });
    }

    // Selve gemmelogikken ligger i dataUtils.
    const newAnsweredSurvey = await createAnsweredSurvey(
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Din besvarelse blev modtaget og gemt!",
      answeredSurvey: newAnsweredSurvey,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUnlinkedAnsweredSurveys(req, res, next) {
  try {
    // Henter kun surveys uden oprettet client.
    const answeredSurveys = await getNewAnsweredSurveys();

    res.status(200).json(
      answeredSurveys
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteAnsweredSurvey(req, res, next) {
  const { surveyId } = req.params;

  try {
    const surveyWasDeleted = await deleteSurveyById(surveyId);

    if (!surveyWasDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Surveybesvarelse blev ikke slettet. Kunne ikke finde survey med dette id'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Surveybesvarelse blev slettet'
    })
  } catch (err) {
    console.error(err);
    next(err);
  }
}