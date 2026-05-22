import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Finder korrekt sti fra denne fil.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sti til alle besvarede surveys.
const pathToAnsweredSurveys = path.join(
  __dirname,
  "../../data/survey/answeredSurveys.json"
);

export async function getAllAnsweredSurveys() {
  // Læser alle gemte survey-besvarelser.
  const fileContent = await fs.readFile(
    pathToAnsweredSurveys,
    "utf-8"
  );

  return JSON.parse(fileContent);
}

async function saveAllAnsweredSurveys(answeredSurveys) {
  // Gemmer hele listen tilbage i JSON-filen.
  await fs.writeFile(
    pathToAnsweredSurveys,
    JSON.stringify(answeredSurveys, null, 4),
    "utf-8"
  );
}

export async function createAnsweredSurvey(surveyAnswers) {
  const answeredSurveys = await getAllAnsweredSurveys();

  // Serveren opretter selv id'et.
  const newAnsweredSurvey = {
    surveyId: crypto.randomUUID(),
    hasRegisteredClient: false,
    survey: surveyAnswers,
  };

  answeredSurveys.push(newAnsweredSurvey);

  await saveAllAnsweredSurveys(answeredSurveys);

  return newAnsweredSurvey;
}

export async function getNewAnsweredSurveys() {
  const answeredSurveys = await getAllAnsweredSurveys();

  // Returnerer kun surveys, der ikke er brugt til client endnu.
  return answeredSurveys.filter(
    (survey) => survey.hasRegisteredClient === false
  );
}

export async function findAnsweredSurveyById(surveyId) {
  const answeredSurveys = await getAllAnsweredSurveys();

  // Finder én survey ud fra dens server-genererede id.
  return (
    answeredSurveys.find(
      (survey) => survey.surveyId === surveyId
    ) ?? null
  );
}

export async function updateAnsweredSurveyById(surveyId, updates) {
  const answeredSurveys = await getAllAnsweredSurveys();

  // Finder placeringen i arrayet.
  const surveyIndex = answeredSurveys.findIndex(
    (survey) => survey.surveyId === surveyId
  );

  if (surveyIndex === -1) {
    return null;
  }

  // Beholder gamle data og overskriver kun det nye.
  const updatedSurvey = {
    ...answeredSurveys[surveyIndex],
    ...updates,
  };

  answeredSurveys[surveyIndex] = updatedSurvey;

  await saveAllAnsweredSurveys(answeredSurveys);

  return updatedSurvey;
}