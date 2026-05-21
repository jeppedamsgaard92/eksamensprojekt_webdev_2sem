import {
  createPendingUserAccount,
  createRegistrationInvitationForUser,
} from "../services/invitations.js";

/*
  Opretter en ny client i systemet.

  Vigtigt:
  Denne controller sender IKKE invitation.
  Den opretter kun client-data, så clienten senere kan få tilknyttet onboarding.
*/
export async function createNewClientAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;

    const user = await createPendingUserAccount({
      name,
      email,
      role: "client",
    });

    res.status(201).json({
      message: "Client account created.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

/*
  Opretter en ny admin.

  Her giver det stadig mening at sende invitation med det samme,
  fordi admin-brugeren ikke skal vente på onboarding-flowet.
*/
export async function createNewAdminAccount(req, res, next) {
  try {
    const { name, email } = req.validatedData;

    const user = await createPendingUserAccount({
      name,
      email,
      role: "admin",
    });

    const invitation =
      await createRegistrationInvitationForUser(user.id);

    res.status(201).json({
      message: "Admin account created and invitation sent.",
      user: invitation.user,
      registrationLink: invitation.registrationLink,
    });
  } catch (error) {
    next(error);
  }
}

/*
  Sender invitation til en eksisterende client.

  Denne controller skal bruges til knappen:
  "Send invitation to onboarding"

  Ideen er:
  - clienten er allerede oprettet
  - onboarding er/kan være knyttet til userId
  - først nu startes registreringsprocessen
*/
export async function sendOnboardingInvitation(req, res, next) {
  try {
    const { userId } = req.validatedData;

    const { user, registrationLink } = await createRegistrationInvitationForUser(userId);

    res.status(200).json({
      message: "Onboarding invitation sent.",
      user,
      registrationLink,
    });
  } catch (error) {
    next(error);
  }
}
