import argon2 from "argon2";

// Dette er det midlertidige password, som admin skal bruge ved allerførste login
async function generatePasswordHash() {
  try {
    const passwordHash = await argon2.hash("123");
    console.log(passwordHash);
  } catch (error) {
    console.error("Kunne ikke generere password-hash:", error);
  }
}

generatePasswordHash();

