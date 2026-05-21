import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { createRegistrationInvitationForUser } from "../services/invitations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mappe til pdf filer
const pdfSlidesFolder = path.join(__dirname, "../public/pdfSlidesDB/");

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
        const pdfFiles = files.filter(file => file !== '.DS_Store');

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

// Til at sende invitation til onboarding
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
}

