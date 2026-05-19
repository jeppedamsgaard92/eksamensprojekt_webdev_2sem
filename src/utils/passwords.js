import argon2 from "argon2";

//Henter password-pepper fra .env, når funktionen bruges.
function getPasswordPepper() {
  const passwordPepper = process.env.PASSWORD_PEPPER;

  if (!passwordPepper) {
    throw new Error("Something went wrong with the password pepper.");
  }

  return passwordPepper;
}

//Hasher password + pepper.
export async function hashPassword(password) {
  return argon2.hash(password + getPasswordPepper());
}

//Bruges i login-flowet til at verificere et indsendt password.
export async function verifyPassword(passwordHash, password) {
  return argon2.verify(
    passwordHash,
    password + getPasswordPepper()
  );
}