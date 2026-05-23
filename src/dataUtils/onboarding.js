import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { success } from "zod";

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

export async function getAllOnboardingCourses() {
    const file = await fs.readFile(onboardingCoursesFile, 'utf-8');

    return JSON.parse(file);
}

export async function saveAllOnboardingCourses(allCourses) {
    fs.writeFile(onboardingCoursesFile, JSON.stringify(allCourses, null, 4), 'utf-8');
}

export async function addCourse(course) {

    const allCourses = await getAllOnboardingCourses();

    // Hvis den ikke finder noget, returnerer .findIndex() altid -1
    const courseIndex = allCourses.findIndex(c => c.courseId === course.courseId);

    // Hvis kurset findes i forvejen (indeks er 0 eller højere)
    if (courseIndex !== -1) {
        allCourses[courseIndex] = course;
    } else {
        allCourses.push(course);
    }

    await saveAllOnboardingCourses(allCourses);
}

export async function findCourseById(id) {
    const allCourses = await getAllOnboardingCourses();

    const thisCourse = allCourses.find(course => course.courseId === id);

    return thisCourse ?? null;
}