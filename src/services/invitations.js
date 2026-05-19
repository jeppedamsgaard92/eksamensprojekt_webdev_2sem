import crypto from "crypto";

import { findUserByEmail, createUser, } from "../dataUtils/users.js";

import { generateSecureToken, hashToken, createExpiryDate, } from "../utils/tokens.js";

//Registreringslinket skal kun være gyldigt i en begrænset periode (48t som udgangspunkt).
const REGISTRATION_TOKEN_EXPIRY_MS = 1000 * 60 * 60 * 48;

//Base URL bruges til at bygge det link, der skal sendes i emailen. Lokalt bruger vi localhost, men senere kan værdien sættes i .env, hvis appen deployes et andet sted.
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

//Opretter en ny bruger med registreringslink til den tilknyttede email.
export async function createUserInvitation({ email, role }) {
  //tjekker først, om emailen allerede findes. Der skal ikke kunne oprettes flere brugere med samme emailadresse.
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error(`A user with "${email}" already exists.`);
  }
  //Opretter id til brugeren.
  const userId = crypto.randomUUID();
  //Genererer registreringstoken.
  const registrationToken = generateSecureToken();
  //Gemmer hash-værdi
  const registrationTokenHash = hashToken(registrationToken);
  //Tokenet får en fast udløbstid. Den gemmes som ISO-dato i JSON-filen.
  const registrationTokenExpiresAt = createExpiryDate(REGISTRATION_TOKEN_EXPIRY_MS);
  /*
    Brugeren oprettes som "pending":
    - rollen kender systemet allerede
    - emailen kender systemet allerede
    - brugernavn og password kommer først, når registreringslinket er verificeret
  */
  const newUser = {
    id: userId,
    role,
    email,

    username: null,
    passwordHash: null,

    registrationCompleted: false,

    registrationTokenHash,
    registrationTokenExpiresAt,
    registrationTokenUsedAt: null,
  };
  //Brugeren gemmes gennem dataUtils, så invitations-flowet ikke selv skriver direkte til users.json.
  const createdUser = await createUser(newUser);
  /*
    Link som brugeren skal åbne.
    Den rå token ligger i URL'en, fordi serveren
    skal kunne validere den, når linket bliver besøgt.
  */
  const registrationLink = `${APP_BASE_URL}/register/activate?token=${registrationToken}`;

  /*
    Jeg returnerer både brugeren og linket.

    OBS!! Lige nu kan et script printe linket i terminalen.
    Senere kan email-logikken sende det automatisk.
  */
  return {
    user: createdUser,
    registrationLink,
  };
}