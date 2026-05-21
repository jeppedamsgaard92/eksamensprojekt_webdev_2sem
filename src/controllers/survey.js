import crypto from "crypto";
import fs from "fs/promises";
import path from 'path';
import { fileURLToPath } from "url";
import { answeredSurvey, surveyQuestions } from "../schemas/survey.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToSurvey = path.join(__dirname, '../../data/survey/survey.json');
const pathToAnsweredSurveys = path.join(__dirname, '../../data/survey/answeredSurveys.json');

// Til at uploade ny survey json-fil
export async function uploadSurveyFile(req, res) {
    const newSurvey = req.body;

    const validation = surveyQuestions.safeParse(newSurvey);

    // Hvis valideringen fejler
    if (!validation.success) {
        console.error("Valideringsfejl:", validation.error.format());

        return res.status(400).json({
            success: false,
            message: 'Dataen skal være et array, og må KUN indeholde tekststrenge!'
        });
    }

    try {
        await fs.writeFile(pathToSurvey, JSON.stringify(validation.data, null, 4), 'utf-8');

        res.status(200).json({ success: true, message: 'Survey blev modtaget' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Kunne ikke gemme survey på server" });
    }
}

// Til at få survey spørgsmål
export async function getSurveyQuestions(req, res) {
    try {
        const surveyFile = await fs.readFile(pathToSurvey, 'utf-8');

        const questions = await JSON.parse(surveyFile);

        res.status(200).json(questions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Kunne ikke finde nogen survey på server" });
    }
}

// Til at uploade besvaret survey
export async function uploadAnsweredSurvey(req, res) {
    const incomingAnswers = req.body;
    const validation = answeredSurvey.safeParse(incomingAnswers);

    if (!validation.success) {
        console.error("Valideringsfejl:", validation.error.format());
        return res.status(400).json({
            success: false,
            message: 'Dataen skal være et array med objekter i format {question: "", answer: ""}'
        });
    }

    let allAnsweredSurveys = [];

    try {
        const answeredSurveysFile = await fs.readFile(pathToAnsweredSurveys, 'utf-8');
        allAnsweredSurveys = JSON.parse(answeredSurveysFile);
    } catch (err) {
        // Hvis fejlen er noget andet end at filen mangler, så log det (f.eks. korrupt JSON)
        if (err.code !== 'ENOENT') {
            console.error("Fejl ved læsning af besvarelsesfil:", err);
            return res.status(500).json({ success: false, message: "Kunne ikke læse eksisterende besvarelser" });
        }
        console.log("answeredSurveys.json findes ikke endnu. Opretter en ny liste!");
    }

    const newAnsweredSurvey = {
        surveyId: crypto.randomUUID(),
        hasRegisteredClient: false,
        survey: validation.data // De validerede [{question, answer}] objekter
    };

    allAnsweredSurveys.push(newAnsweredSurvey);

    try {
        await fs.writeFile(pathToAnsweredSurveys, JSON.stringify(allAnsweredSurveys, null, 4), 'utf-8');
        res.status(200).json({
            success: true,
            message: 'Din besvarelse blev modtaget og gemt!'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Kunne ikke gemme survey-besvarelsen på server" });
    }
}

export async function getAvailableAnsweredSurveys(req, res, next) {
  try {
    const answeredSurveys =
      await getUnregisteredAnsweredSurveys();

    res.status(200).json({
      answeredSurveys,
    });
  } catch (error) {
    next(error);
  }
}