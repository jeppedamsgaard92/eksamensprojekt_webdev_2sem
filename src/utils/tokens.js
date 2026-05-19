import crypto from "crypto";

/*
  Genererer en token. Bruger 32 random bytes og laver dem om til hex.
*/
export function generateSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}

/*
  Hasher token med SHA-256.
  Vi gemmer kun den hashede token - ikke selve token.
  SHA-256 er fint her - behøver ikke være langsom som ved passwords.
*/
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/*
  Opretter en udløbstid ud fra et antal millisekunder.
  Funktionen returnerer en ISO-dato som tekst, fordi den er nem at gemme i JSON og senere konvertere tilbage til en Date.
*/
export function createExpiryDate(durationInMs) {
  return new Date(Date.now() + durationInMs).toISOString();
}

//Genererer en separat CSRF-token til formularer med state-changing requests.
export function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}