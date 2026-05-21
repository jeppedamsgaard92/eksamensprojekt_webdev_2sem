import { z } from "zod";

export const surveyQuestions = z.array(z.string());

export const answeredSurvey = z.array(
    z.object({
        question: z.string(),
        answer: z.string()
    })
);