import fs from "fs/promises";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToSurvey = path.join(__dirname, '../../data/survey/survey.json');

// Til at uploade ny survey json-fil
export async function uploadSurveyFile(req, res) {
    const newSurvey = req.body;

    try {
        await fs.writeFile(pathToSurvey, JSON.stringify(newSurvey, null, 4), 'utf-8');

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