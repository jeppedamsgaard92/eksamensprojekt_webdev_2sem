import "dotenv/config";

import { createUserInvitation } from "../src/services/invitations.js";

/*
  Den første admin skal oprettes uden om appens normale UI,
  fordi der endnu ikke findes en admin, som kan invitere andre brugere.

  Derfor hardcoder jeg den første admins oplysninger her i et engangsscript.
*/
const INITIAL_ADMIN_EMAIL = "torben@laudrup.com";
const role = 'client';
const name = 'Kim Larsen'

/*
  Scriptet opretter:
  - en pending bruger
  - en registreringstoken
  - et registreringslink

  Linket printes foreløbigt i terminalen.
  Senere kan det samme flow kobles på email-afsendelse.
*/
async function createInitialAdmin() {
  try {
    const { user, registrationLink } = await createUserInvitation({
      email: INITIAL_ADMIN_EMAIL,
      role: role,
      name: name,
    });

    console.log("Første admin er oprettet:");
    console.log(`Email: ${user.email}`);
    console.log(`Rolle: ${user.role}`);
    console.log("");

    console.log("Registreringslink:");
    console.log(registrationLink);
  } catch (error) {
    console.error("Kunne ikke oprette første admin:", error.message);
  }
}

createInitialAdmin();

//node scripts/create-initial-admin.js