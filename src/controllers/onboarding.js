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
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Ingen filer modtaget.' });
        }

        const gemteFiler = req.files.map(file => {
            return {
                fileName: file.originalname, // Nu det rigtige navn, f.eks. "onboarding.pdf"
                url: `http://localhost:3000/data/pdfSlidesDB/${file.originalname}`
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