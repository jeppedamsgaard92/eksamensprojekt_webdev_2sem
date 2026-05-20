import { findUserByUsername } from "../dataUtils/users.js";
import { verifyPassword } from "../utils/passwords.js";

export async function loginUser({ username, password }) {
  // Finder brugeren ud fra username.
  const user = await findUserByUsername(username);

  // Samme generiske fejl uanset om bruger eller password er forkert.
  if ( !user || !user.registrationCompleted || !user.passwordHash ) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }

  // Tjekker password mod Argon2-hash + pepper.
  const passwordIsValid = await verifyPassword( user.passwordHash, password );

  if (!passwordIsValid) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }

  return {
    success: true,
    user,
  };
}