import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

//mappe stin til denne fil, så jeg kan finde users.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// vi bruger en JSON-fil som "database" for brugerne
const usersFilePath = path.join(__dirname, "../../data/users.json");

//Henter alle brugere 
export async function getAllUsers() {
    const fileContent = await fs.readFile(usersFilePath, "utf8");

    return JSON.parse(fileContent);
}

//Gemmer hele brugerlisten tilbage i users.json.
async function saveAllUsers(users) {
    const json = JSON.stringify(users, null, 2);
    await fs.writeFile(usersFilePath, json, "utf8");
}

//finder bruger ud fra id.
export async function findUserById(userId) {
    const users = await getAllUsers();

    return users.find((user) => user.id === userId) ?? null;
}

//Finder bruger ud fra email.
export async function findUserByEmail(email) {
    const users = await getAllUsers();

    return users.find((user) => user.email === email) ?? null;
}

/*
  Tilføjer en ny bruger til users.json.

  Jeg laver et ekstra serverside-tjek for både id og email,
  så jeg ikke ved en fejl får dubletter i brugerdata.
  Det er især vigtigt, fordi funktionen senere kan blive brugt
  både af et script og af en admin-route.
*/
export async function createUser(newUser) {
    const users = await getAllUsers();

    const idAlreadyExists = users.some((user) => user.id === newUser.id);

    if (idAlreadyExists) {
        throw new Error(`En bruger med id "${newUser.id}" findes allerede.`);
    }

    const emailAlreadyExists = users.some(
        (user) => user.email === newUser.email
    );

    if (emailAlreadyExists) {
        throw new Error(
            `En bruger med email "${newUser.email}" findes allerede.`
        );
    }

    users.push(newUser);

    await saveAllUsers(users);

    return newUser;
}

/*
  Opdaterer én bruger ud fra id.
  - sender kun de felter med, som skal ændres,
    fx registrationTokenHash, username eller passwordHash.
  - De eksisterende felter bevares med: ...user
  - De nye værdier overskriver med: ...updates
*/
export async function updateUserById(userId, updates) {
    const users = await getAllUsers();

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return null;
    }

    const updatedUser = { //Lav et nyt objekt med alle de gamle brugerdata, og overskriv derefter kun de felter, der findes i updates.
        ...users[userIndex],
        ...updates,
    };

    users[userIndex] = updatedUser;

    await saveAllUsers(users);

    return updatedUser;
}

// Finder brugeren, der har netop denne registrerings-token-hash.
// Når en bruger åbner et registreringslink, hasher serveren tokenen fra URL'en og bruger denne funktion til at finde den tilhørende bruger.

export async function findUserByRegistrationTokenHash(tokenHash) {
  const users = await getAllUsers();

  return (
    users.find(
      (user) => user.registrationTokenHash === tokenHash
    ) ?? null
  );
}

//Finder én bruger ud fra username.
export async function findUserByUsername(username) {
  const users = await getAllUsers();

  return users.find((user) => user.username === username) ?? null;
}