import { z } from "zod";

export const surveyQuestions = z.array(z.string()
      .trim()
      .min(1, "Question cannot be empty.")
      .max(1000, "Question must be 1000 characters or fewer.")
  )
  .min(1, "Survey must contain at least one question.")
  .max(100, "Survey can contain maximum 100 questions.");

export const answeredSurvey = z.array(z.object({
      question: z.string().trim().min(1).max(1000),
      answer: z.string().trim().min(1).max(1000),
    })
  ).min(1).max(100);