import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fil til youtube links
const youtubeLinksFile = path.join(__dirname, "../../data/onboarding/youtubeLinks.json");

// Fil til onboarding kurser
const onboardingCoursesFile = path.join(__dirname, "../../data/onboarding/courses.json");

export async function getAllSavedYoutubeLinks() {
    const file = await fs.readFile(youtubeLinksFile, 'utf-8');
    const existingLinks = JSON.parse(file);

    return existingLinks;
}

export async function saveAllYoutubeLinks(allLinks) {
    await fs.writeFile(youtubeLinksFile, JSON.stringify(allLinks, null, 4), 'utf-8');
}

export async function deleteYoutubeLinkById(id) {
    const allLinks = await getAllSavedYoutubeLinks();

    let wasDeleted = false;

    for (let i = 0; i < allLinks.length; i++) {
        if (allLinks[i].id === id) {
            allLinks.splice(i, 1);
            wasDeleted = true
            break;
        }
    }

    if (wasDeleted) {
        await saveAllYoutubeLinks(allLinks);
    }

    return wasDeleted ? allLinks : null;
}

// Til at slette pdf-fil
export async function deletePdfByPath(fullPath) {
    await fs.unlink(fullPath);
}

export async function getAllOnboardingCourses() {
    const file = await fs.readFile(onboardingCoursesFile, 'utf-8');

    return JSON.parse(file);
}

export async function saveAllOnboardingCourses(allCourses) {
    await fs.writeFile(onboardingCoursesFile, JSON.stringify(allCourses, null, 4), 'utf-8');
}

export async function addCourse(course) {

    const allCourses = await getAllOnboardingCourses();

    // Hvis den ikke finder noget, returnerer .findIndex() altid -1
    const courseIndex = allCourses.findIndex(c => c.courseId === course.courseId);

    let status;

    // Hvis kurset findes i forvejen (indeks er 0 eller højere)
    if (courseIndex !== -1) {
        allCourses[courseIndex] = course;
        status = 'Det eksisterende kursus blev opdateret.'
    } else {
        allCourses.push(course);
        status = 'Det nye kursus blev oprettet.'
    }

    await saveAllOnboardingCourses(allCourses);

    return status;
}

export async function findCourseById(id) {
    const allCourses = await getAllOnboardingCourses();

    const thisCourse = allCourses.find(course => course.courseId === id);

    return thisCourse ?? null;
}

export async function deleteCourseById(id) {
    const allCourses = await getAllOnboardingCourses();

    let wasDeleted = false;

    for (let i = 0; i < allCourses.length; i++) {
        if (allCourses[i].courseId === id) {
            allCourses.splice(i, 1);
            wasDeleted = true;
            break;
        }
    }

    if (wasDeleted) {
        await saveAllOnboardingCourses(allCourses);
    }

    return wasDeleted;
}