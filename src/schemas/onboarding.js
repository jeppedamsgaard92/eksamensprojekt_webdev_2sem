import { z } from "zod";

export const onboardingCourseSchema = z.array(
    z.object({
        type: z.enum(['pdf', 'youtube']), // Må KUN være en af disse to strenge
        src: z.string().url()             // Skal være en tekststreng og en gyldig URL
    })
);

export const onboardingCourseSchemaWithProgress = z.array(
    z.object({
        type: z.enum(['pdf', 'youtube']), // Må KUN være en af disse to strenge
        src: z.string().url(),            // Skal være en tekststreng og en gyldig URL
        complete: z.boolean()             // Skal være true eller false
    })
);