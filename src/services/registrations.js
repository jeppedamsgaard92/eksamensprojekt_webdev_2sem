import { findUserById, findUserByUsername, findUserByRegistrationTokenHash, updateUserById, } from "../dataUtils/users.js";

import { hashToken } from "../utils/tokens.js";
import { hashPassword } from "../utils/passwords.js";

export async function verifyRegistrationToken(token) {
  //Token skal komme ind som en ikke-tom tekststreng. Hvis token mangler helt, er linket ugyldigt.
  if (typeof token !== "string" || token.trim() === "") {
    return null;
  }
  //hasher den
  const registrationTokenHash = hashToken(token);

  //Token-hash'en bruges til at finde den bruger, som invitationen hører til.
  const user = await findUserByRegistrationTokenHash(
    registrationTokenHash
  );

  if (!user) {
    return null;
  }

  //Hvis brugeren allerede er færdigregistreret, må registreringslinket ikke bruges igen.
  if (user.registrationCompleted) {
    return null;
  }

  //Invitationen må ikke allerede være brugt.
  if (user.registrationTokenUsedAt) {
    return null;
  }

  //Token skal have en gyldig udløbstid.
  const expiryTime = Date.parse(user.registrationTokenExpiresAt);
  if (Number.isNaN(expiryTime)) {
    return null;
  }

  //valider udløbsdato
  if (Date.now() > expiryTime) {
    return null;
  }

  // Returnerer både brugeren og token-hash'en.
  return {
    user,
    registrationTokenHash,
  };
}

//Færdiggør registreringen ved at gemme username og password på den bruger, som sessionen peger på.
export async function completeUserRegistration({
  userId,
  registrationTokenHash,
  username,
  password,
}) {
  const user = await findUserById(userId);

  //Sessionen må kun bruges, hvis den stadig peger på en gyldig pending user.
  if (!user || user.registrationCompleted) {
    return {
      success: false,
      reason: "INVALID_REGISTRATION_SESSION",
    };
  }

  //Token-hash i sessionen skal stadig matche den token-hash, der ligger på brugeren.
  if (
    !user.registrationTokenHash ||
    user.registrationTokenHash !== registrationTokenHash
  ) {
    return {
      success: false,
      reason: "INVALID_REGISTRATION_SESSION",
    };
  }

  //Invitationen må ikke allerede være brugt.
  if (user.registrationTokenUsedAt) {
    return {
      success: false,
      reason: "INVALID_REGISTRATION_SESSION",
    };
  }

  //Tokenen skal stadig være gyldig på det tidspunkt, hvor registreringen færdiggøres.
  const expiryTime = Date.parse(user.registrationTokenExpiresAt);

  if (Number.isNaN(expiryTime) || Date.now() > expiryTime) {
    return {
      success: false,
      reason: "INVALID_REGISTRATION_SESSION",
    };
  }

  //Brugernavn skal være unikt.
  const existingUserWithUsername =
    await findUserByUsername(username);

  if (existingUserWithUsername) {
    return {
      success: false,
      reason: "USERNAME_ALREADY_EXISTS",
    };
  }

  //Password hashes med Argon2, før det gemmes.
  const passwordHash = await hashPassword(password);

  //Brugeren aktiveres, og invitationen gøres ugyldig.
  const updatedUser = await updateUserById(user.id, {
    username,
    passwordHash,
    registrationCompleted: true,
    registrationTokenHash: null,
    registrationTokenExpiresAt: null,
    registrationTokenUsedAt: new Date().toISOString(),
  });

  if (!updatedUser) {
    throw new Error("Could not update user during registration.");
  }

  return {
    success: true,
    user: updatedUser,
  };
}