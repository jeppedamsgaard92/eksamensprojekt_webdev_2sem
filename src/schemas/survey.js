import { z } from "zod";

export const surveyQuestions = z
  .array(
    z.string()
      .trim()
      .min(1, "Question cannot be empty.")
      .max(1000, "Question must be 1000 characters or fewer.")
  )
  .min(3, "Survey must contain at least 3 items (including company name and email).") // Sat til 3, da de to sidste er optaget
  .max(100, "Survey can contain maximum 100 questions.")

  // Vi laver et custom tjek på arrayet
  .superRefine((questions, ctx) => {
    const totalItems = questions.length;

    // Find de to sidste elementer i arrayet
    const nestLastItem = questions[totalItems - 2]; // Næstsidste
    const lastItem = questions[totalItems - 1];     // Absolut sidste

    // Tjek om det næstsidste element er "Virksomhedsnavn"
    if (nestLastItem !== "Virksomhedsnavn") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Det næstsidste spørgsmål SKAL være præcis "Virksomhedsnavn". Lige nu er det "${nestLastItem}"`,
        path: [totalItems - 2], // Fortæller præcis hvilket indeks fejlen ligger på
      });
    }

    // Tjek om det sidste element er "Email"
    if (lastItem !== "Email") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Det sidste spørgsmål SKAL være præcis "Email". Lige nu er det "${lastItem}"`,
        path: [totalItems - 1], // Fortæller præcis hvilket indeks fejlen ligger på
      });
    }
  });

export const answeredSurvey = z.array(z.object({
  question: z.string().trim().min(1).max(1000),
  answer: z.string().trim().min(1).max(1000),
})
).min(1).max(100);