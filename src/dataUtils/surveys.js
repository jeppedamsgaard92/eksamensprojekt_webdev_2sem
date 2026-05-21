import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToAnsweredSurveys = path.join(
  __dirname,
  "../../data/survey/answeredSurveys.json"
);

export async function getAllAnsweredSurveys() {
  const fileContent = await fs.readFile(
    pathToAnsweredSurveys,
    "utf-8"
  );

  return JSON.parse(fileContent);
}

export async function findAnsweredSurveyById(surveyId) {
  const surveys = await getAllAnsweredSurveys();

  return (
    surveys.find(
      (survey) => survey.surveyId === surveyId
    ) ?? null
  );
}

export async function updateAnsweredSurveyById(
  surveyId,
  updates
) {
  const surveys = await getAllAnsweredSurveys();

  const surveyIndex = surveys.findIndex(
    (survey) => survey.surveyId === surveyId
  );

  if (surveyIndex === -1) {
    return null;
  }

  const updatedSurvey = {
    ...surveys[surveyIndex],
    ...updates,
  };

  surveys[surveyIndex] = updatedSurvey;

  await fs.writeFile(
    pathToAnsweredSurveys,
    JSON.stringify(surveys, null, 4),
    "utf-8"
  );

  return updatedSurvey;
}

export async function getUnregisteredAnsweredSurveys() {
  const surveys = await getAllAnsweredSurveys();

  return surveys.filter(
    (survey) => survey.hasRegisteredClient === false
  );
}