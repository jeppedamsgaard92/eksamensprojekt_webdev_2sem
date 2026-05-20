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
  const userId = crypto.randomUUID();  //Opretter id til brugeren.
  const registrationToken = generateSecureToken();   //Genererer registreringstoken.
  const registrationTokenHash = hashToken(registrationToken);   //Gemmer hash-værdi
  const registrationTokenExpiresAt = createExpiryDate(REGISTRATION_TOKEN_EXPIRY_MS);   //Tokenet får en fast udløbstid. Den gemmes som ISO-dato i JSON-filen.

  //Brugeren oprettes som "pending" - dvs den ikke er færdig endnu. Systemet kender email og role, men resten kommer senere, når brugeren selv registrere sig.
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
  //Brugeren gemmes gennem /dataUtils (createUser() kommer derfra), så invitations-flowet ikke selv skriver direkte til users.json. Så kan det laves til SQL eller whatever på et senere tidspunkt hvis det er, fordi alt data håndterings logik ligger i dataUtils.
  const createdUser = await createUser(newUser);
  
  //Link med token som brugeren skal åbne - leder til aktivering/registrering.
  const registrationLink = `${APP_BASE_URL}/register/activate?token=${registrationToken}`;

  // returnerer både brugeren og linket. OBS!! Lige nu kan et script printe linket i terminalen. Senere kan email-logikken sende det automatisk.
  return {
    user: createdUser,
    registrationLink,
  };
}