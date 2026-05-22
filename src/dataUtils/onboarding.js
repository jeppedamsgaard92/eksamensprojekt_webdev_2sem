import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fil til youtube links
const youtubeLinksFile = path.join(__dirname, "../../data/onboarding/youtubeLinks.json");

export async function getAllSavedYoutubeLinks() {
    const file = await fs.readFile(youtubeLinksFile, 'utf-8');
    const existingLinks = JSON.parse(file);

    return existingLinks;
}