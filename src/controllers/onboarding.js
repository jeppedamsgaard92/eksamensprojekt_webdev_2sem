import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fortæl multer, hvilken mappe filerne skal lande i
const upload = multer({ dest: path.join(__dirname, "../../data/pdfSlidesDB/") });

export function uploadPdfFiles(req, res) {
    try {
        // Tjek om der overhovedet kom nogle filer med i anmodningen
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Ingen filer modtaget. Husk at bruge nøglen "files" i FormData.'
            });
        }

        // Loop igennem de gemte filer og formatér den data, du skal bruge
        const gemteFiler = req.files.map(file => {
            return {
                originalName: file.originalname,  // F.eks. "onboarding_del1.pdf" -> Perfekt til SQL!
                serverFileName: file.filename,    // Det unikke navn multer har givet den på disken
                filePath: `/data/pdfSlidesDB/${file.filename}` // Stien som din iframe skal bruge
            };
        });

        console.log('Filer modtaget og gemt i pdfSlidesDB:', gemteFiler);

        // Svar frontenden med succeskode og listen over de gemte filer
        return res.status(201).json({
            success: true,
            message: 'PDF-filer uploadet og gemt succesfuldt!',
            files: gemteFiler
        });

    } catch (error) {
        console.error('Fejl i uploadPdfFiles controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Der skete en intern serverfejl under upload.'
        });
    }
}