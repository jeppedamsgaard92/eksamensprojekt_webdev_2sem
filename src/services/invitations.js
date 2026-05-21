import crypto from "crypto";

import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
} from "../dataUtils/users.js";

import {
  generateSecureToken,
  hashToken,
  createExpiryDate,
} from "../utils/tokens.js";

// Registreringslinket skal kun være gyldigt i en begrænset periode.
const REGISTRATION_TOKEN_EXPIRY_MS = 1000 * 60 * 60 * 48;

// Base URL bruges til at bygge det link, der senere skal sendes i emailen.
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

/*
  Opretter en bruger i systemet uden at starte registreringsprocessen.

  Funktionen bruges fx når admin opretter en client:
  - userId oprettes
  - navn, email og role gemmes
  - username/password er stadig tomme
  - der laves IKKE registration-token endnu
*/
export async function createPendingUserAccount({ id, name, email, role }) {
  // Der må ikke oprettes flere brugere med samme email.
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error(`A user with "${email}" already exists.`);
  }

  /*
    Brugeren oprettes som pending.

    Det betyder:
    - systemet kender personen
    - personen har en rolle
    - personen har endnu ikke valgt username/password
    - personen kan ikke logge ind endnu
  */
  const newUser = {
    id,
    name,
    role,
    email,
    username: null,
    passwordHash: null,
    registrationCompleted: false,

    // Ingen invitation endnu. Den oprettes først via en separat handling.
    registrationTokenHash: null,
    registrationTokenExpiresAt: null,
    registrationTokenUsedAt: null,
  };

  // Selve skrivningen til users.json håndteres i dataUtils.
  return createUser(newUser);
}

/*
  Starter registreringsprocessen for en allerede oprettet bruger.

  Funktionen bruges fx når admin klikker:
  "Send invitation to onboarding"

  Her oprettes:
  - rå registration-token
  - hash af tokenen, som gemmes på brugeren
  - udløbstid
  - registrationLink, som kan sendes til brugerens email
*/
export async function createRegistrationInvitationForUser(userId) {
  // Finder den bruger, invitationen skal knyttes til.
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Hvis brugeren allerede har færdiggjort registreringen, skal der ikke laves nyt link.
  if (user.registrationCompleted) {
    throw new Error("User has already completed registration.");
  }

  // Rå token sendes kun til brugeren. Kun hash gemmes i datafilen.
  const registrationToken = generateSecureToken();
  const registrationTokenHash = hashToken(registrationToken);

  // Tokenen får en fast udløbstid.
  const registrationTokenExpiresAt = createExpiryDate(
    REGISTRATION_TOKEN_EXPIRY_MS
  );

  /*
    Token-data gemmes på den eksisterende bruger.

    Hvis der allerede lå en gammel ubrugt token, bliver den overskrevet.
    Det betyder, at kun det nyeste invitationslink virker.
  */
  const updatedUser = await updateUserById(user.id, {
    registrationTokenHash,
    registrationTokenExpiresAt,
    registrationTokenUsedAt: null,
  });

  // Link med rå token. Det er dette link, brugeren åbner fra emailen.
  const registrationLink = `${APP_BASE_URL}/register/activate?token=${registrationToken}`;
  console.log(`Registration link for ${user.email}: ${registrationLink}`);

  return {
    user: updatedUser,
    registrationLink,
  };
}