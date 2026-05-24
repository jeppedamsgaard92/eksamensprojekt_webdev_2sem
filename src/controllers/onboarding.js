import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { createRegistrationInvitationForUser } from "../services/invitations.js";
import { addCourse, getAllSavedYoutubeLinks, findCourseById, deleteCourseById } from "../dataUtils/onboarding.js";
import crypto from 'crypto';
import { sendRegistrationInvitationEmail } from "../services/email.js";
import { findUserById } from "../dataUtils/users.js";
import { onboardingCourseSchema, onboardingCourseSchemaWithProgress } from "../schemas/onboarding.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mappe til pdf filer
const pdfSlidesFolder = path.join(__dirname, "../public/pdfSlidesDB/");

// Fil til youtube links
const youtubeLinksFile = path.join(__dirname, "../../data/onboarding/youtubeLinks.json");

// Til at uploade pdf-filer
export function uploadPdfFiles(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Ingen filer modtaget.' });
        }

        // TJEK: Gå igennem alle filer og valider at det KUN er PDF'er
        const indeholderIkkePdf = req.files.some(file => file.mimetype !== 'application/pdf');

        if (indeholderIkkePdf) {
            return res.status(400).json({
                success: false,
                message: 'Forkert filformat! Du må kun uploade PDF-filer.'
            });
        }

        const gemteFiler = req.files.map(file => {
            return {
                fileName: file.originalname, // Det rigtige navn, f.eks. "onboarding.pdf"
                url: `http://localhost:${process.env.PORT ?? '2000'}/pdfSlidesDB/${file.originalname}`
            };
        });

        return res.status(201).json({
            success: true,
            message: 'Filer gemt (og eventuelle dubletter er blevet erstattet!)',
            files: gemteFiler
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Fejl under upload.' });
    }
}

// Til at få alle pdf filer
export async function getAllPdfFiles(req, res) {
    try {
        const files = await fs.readdir(pdfSlidesFolder);

        // Filtrerer .DS_Store fra (en usynlig systemfil som Mac automatisk laver i mapper)
        const pdfFiles = files.filter(file => file !== '.DS_Store' && file.endsWith('.pdf'));

        const fileList = pdfFiles.map(filename => {
            return {
                filnavn: filename, // normale filnavn
                src: `http://localhost:${process.env.PORT ?? "2000"}/pdfSlidesDB/${filename}`
            };
        });

        return res.status(200).json(fileList);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Kunne ikke hente filer." });
    }
}

// Til at uploade youtube links
export async function uploadYoutubeLinks(req, res, next) {

    const newLinks = req.body;

    if (!Array.isArray(newLinks)) {
        return res.status(400).json({ success: false, message: "Data skal være et array af links" });
    }

    let existingLinks = [];

    try {
        existingLinks = await getAllSavedYoutubeLinks();
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error("Fejl ved læsning af youtube-fil:", err);
            return res.status(500).json({ success: false, message: "Kunne ikke læse eksisterende links" });
        }
        // Hvis filen ikke findes (ENOENT), fortsætter vi bare med det tomme array []
    }

    // Filtrer eksisterende links fra
    const unikkeNyeLinks = newLinks.filter(nyLink => {
        const findesAllerede = existingLinks.some(eksisterende => eksisterende.url === nyLink.url);
        return !findesAllerede;
    });

    // Hvis der slet ikke var nogen nye, unikke links efter filtreringen
    if (unikkeNyeLinks.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Alle de sendte links findes allerede i systemet!"
        });
    }

    const newLinksWithId = unikkeNyeLinks.map(link => {
        return {
            ...link,
            id: crypto.randomUUID()
        }
    })

    existingLinks.push(...newLinksWithId);

    try {
        await fs.writeFile(youtubeLinksFile, JSON.stringify(existingLinks, null, 4), 'utf-8');

        return res.status(200).json({
            success: true,
            message: "Youtube links blev uploadet og gemt!",
            allLinks: existingLinks,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Kunne ikke uploade youtube links" });
    }
}

// Til at fetche gemte youtube links
export async function getSavedYoutubeLinks(req, res) {
    let existingLinks = [];

    try {
        existingLinks = await getAllSavedYoutubeLinks();
        res.status(200).json(existingLinks);
    } catch (err) {
        console.error("Fejl ved læsning af youtube-fil:", err);
        return res.status(500).json({ success: false, message: "Kunne ikke læse eksisterende links" });
    }
}

// Til at oprette onboarding course til specifik klient
export async function createOnboardingCourse(req, res, next) {
    const { userId } = req.params;

    const userTarget = await findUserById(userId);

    if (!userTarget) {
        return res.status(404).json({
            success: false,
            message: "Kunne ikke oprette kursus: Brugeren blev ikke fundet i systemet."
        });
    }

    const incomingSlides = req.body;

    const validation = onboardingCourseSchema.safeParse(incomingSlides);

    if (!validation.success) {
        console.error("Valideringsfejl på onboarding-kursus:", validation.error.format());
        return res.status(400).json({
            success: false,
            message: "Formatet på dine slides er forkert. Hver slide skal have 'type' (pdf/youtube) og en gyldig 'src' URL.",
            errors: validation.error.errors
        });
    }

    const finalSlides = incomingSlides.map(slide => {
        return {
            ...slide,
            complete: false
        }
    })

    const course = {
        courseId: userId,
        onboardingSlides: finalSlides
    }

    const status = await addCourse(course);

    res.status(200).json({
        success: true,
        message: status
    })
}

// Til at sende invitation til onboarding
/* til prototype uden email integration
export async function sendOnboardingInvitation(req, res, next) {
    try {
        const { userId } = req.params;
        const { user, registrationLink } =
            await createRegistrationInvitationForUser(userId);
        res.status(200).json({
            message: "Onboarding invitation sent.",
            user,
            registrationLink,
        });
    } catch (error) {
        next(error);
    }
}*/

//med Resend integration for at sende emailen med invitationen
export async function sendOnboardingInvitation(req, res, next) {
    try {
        const { userId } = req.params;

        const userHasOnboardingCourse = findCourseById(userId);
        if (!userHasOnboardingCourse) {
            res.status(500).JSON({
                success: false,
                message: 'Brugeren har ikke et onboarding kursus endnu.'
            })
        }

        const { user, registrationLink } = await createRegistrationInvitationForUser(userId);
        await sendRegistrationInvitationEmail({
            to: user.email,
            name: user.name,
            registrationLink,
        });

        res.status(200).json({
            success: true,
            message: "Onboarding invitation sent.",
            user,
        });
    } catch (error) {
        next(error);
    }
}


export async function getLinkedOnboardingCourse(req, res, next) {
    try {
        const userId = req.session.user.id;

        const course = await findCourseById(userId);

        if (!course) {
            return res.status(404).json({
                message: "No onboarding course found for this user.",
            });
        }

        res.status(200).json(course.onboardingSlides);
    } catch (error) {
        next(error);
    }
}

export async function updateOnboardingProgress(req, res, next) {
    try {
        // Tjek om formatet på indkomne slides
        const incomingSlides = req.body;

        const validation = onboardingCourseSchemaWithProgress.safeParse(incomingSlides);

        if (!validation.success) {
            console.error("Valideringsfejl på onboarding-kursus:", validation.error.format());
            return res.status(400).json({
                success: false,
                message: "Formatet på dine slides er forkert. Hver slide skal have 'type' (pdf/youtube), en gyldig 'src' URL og 'complete' (true/false)",
                errors: validation.error.errors
            });
        }

        const validIncomingSlides = validation.data;

        // Finder det originale kursus (Finder gemt kursus på brugeren, der er logget ind)
        const id = req.session.user.id;
        const existingCourse = await findCourseById(id);

        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Der blev ikke fundet noget onboarding-kursus for din bruger."
            });
        }

        // SIKKERHEDSTJEK: Er der blevet manipuleret med antallet af slides?
        if (validIncomingSlides.length !== existingCourse.onboardingSlides.length) {
            return res.status(400).json({
                success: false,
                message: "Sikkerhedsfejl: Antallet af slides matcher ikke det originale kursus!"
            });
        }

        // SIKKERHEDSTJEK: Løb igennem og sammenlign type og src for hver evig eneste slide
        for (let i = 0; i < existingCourse.onboardingSlides.length; i++) {
            const originalSlide = existingCourse.onboardingSlides[i];
            const incomingSlide = validIncomingSlides[i];

            // Hvis type eller src er blevet ændret, så stopper vi med det samme
            if (originalSlide.type !== incomingSlide.type || originalSlide.src !== incomingSlide.src) {
                return res.status(403).json({
                    success: false,
                    message: "Sikkerhedsfejl: Du må ikke ændre på slides' indhold (type eller URL), kun fremskridt!"
                });
            }
        }

        // 5. Hvis koden overlever løkken, er alt data reelt! Vi opdaterer kurset
        existingCourse.onboardingSlides = validIncomingSlides;

        // Gemmer det opdaterede kursus i JSON-filen
        await addCourse(existingCourse);

        return res.status(200).json({
            success: true,
            message: "Onboarding progress blev gemt",
            onboardingSlides: existingCourse.onboardingSlides
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function deleteOnboardingCourse(req, res) {
    try {
        const { clientId } = req.params;

        // Tjek om bruger findes
        const userExists = findUserById(clientId);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "Kunne ikke slette kursus: Klienten findes ikke i systemet."
            });
        }

        // Slet kursus
        const courseWasDeleted = await deleteCourseById(clientId);

        if (courseWasDeleted) {
            return res.status(200).json({
                success: true,
                message: "Onboarding kursus blev slettet"
            });
        } else {
            // Hvis brugeren eksisterer, men deleteCourseById returner false
            return res.status(400).json({
                success: false,
                message: "Klienten havde ikke noget aktivt onboarding-kursus at slette."
            });
        }

    } catch (err) {
        console.error(err);
    }
}

