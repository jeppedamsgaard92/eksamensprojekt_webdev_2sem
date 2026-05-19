import {
  verifyRegistrationToken,
  completeUserRegistration,
} from "../services/registrations.js";

import {
  generateCsrfToken,
  hashToken,
} from "../utils/tokens.js";
/*
  Denne controller rammes, når brugeren åbner linket fra emailen:
  /register/activate?token=...

  Hvis tokenen er gyldig:
  - oprettes en ny registrerings-session
  - bindes sessionen til den konkrete bruger
  - redirecter til /register uden token i URL'en
*/
export async function activateRegistration(req, res, next) {
  try {
    const { token } = req.query;
    const verifiedRegistration = await verifyRegistrationToken(token);

    if (!verifiedRegistration) {
      return res
        .status(400)
        .send("The link to register is either invalid or expired. Contact customer support.");
    }

    const { user, registrationTokenHash, } = verifiedRegistration;

    // Regenererer session-ID'et, når brugeren går fra almindelig anonym besøgende til en browser, der må færdiggøre registrering for en konkret invitation.
    // Det reducerer risikoen for session fixation.
    
    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      /*
        Sessionen bliver nu en begrænset registrerings-session.
        Den betyder IKKE, at brugeren er logget ind!
        Den betyder kun: "Denne browser har verificeret et gyldigt registreringslink og må fortsætte registreringsflowet."
      */
      req.session.pendingRegistrationUserId = user.id;

      /*
        Gemmer også token-hash'en i sessionen.
        Når brugeren senere sender brugernavn og kodeord, kan det kontrolleres, at det stadig er den samme invitation, der ligger bag registreringen.
      */
      req.session.pendingRegistrationTokenHash =
        registrationTokenHash;

      /*
        Sessionen gemmes eksplicit før redirect.
        express-session gemmer automatisk, men har læst et sted, at det kan være smart at gemme med .save for en sikkerhedsskyld.
      */
      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }
        //Brugeren sendes videre uden token i URL'en.
        // Det er bedre end at vise formularen direkte på /register/activate?token=..., fordi tokenen så ikke bliver liggende synligt i browserens adressefelt.
        res.redirect("/register");
      });
    });
  } catch (error) {
    next(error);
  }
}

//Viser en midlertidig registreringsformular med CSRF-beskyttelse.
export function showRegistrationPage(req, res) {
  //Der genereres en ny CSRF-token for denne formularvisning.
  const csrfToken = generateCsrfToken();

  //Kun hash af CSRF-tokenen gemmes i sessionen.
  req.session.csrfTokenHash = hashToken(csrfToken);

  res.status(200).send(`
    <h1>Complete registration</h1>

    <form method="POST" action="/register">
      <input
        type="hidden"
        name="_csrf"
        value="${csrfToken}"
      />

      <div>
        <label for="username">Username</label>

        <input
          id="username"
          name="username"
          type="text"
          required
        />
      </div>

      <br />

      <div>
        <label for="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          required
        />
      </div>

      <br />

      <div>
        <label for="confirmPassword">
          Confirm password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </div>

      <br />

      <button type="submit">
        Complete registration
      </button>
    </form>
  `);
}


//Gemmer brugerens valgte username og password, hvis registrerings-sessionen stadig er gyldig.
export async function completeRegistration(req, res, next) {
  try {
    const { username, password } = req.validatedData;

    const result = await completeUserRegistration({
      userId: req.session.pendingRegistrationUserId,
      registrationTokenHash:
        req.session.pendingRegistrationTokenHash,
      username,
      password,
    });

    //Brugernavnet er allerede taget af en anden bruger.
    if (
      !result.success &&
      result.reason === "USERNAME_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        message: "Username is already in use.",
      });
    }

    //Sessionen eller invitationen er ikke længere gyldig.
    if (!result.success) {
      return res.status(400).json({
        message:
          "This registration session is no longer valid. Please use a fresh registration link.",
      });
    }

    //Den begrænsede registrerings-session skal væk, når registreringen er færdig.
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.status(200).json({
        message: "Registration completed. You can now log in.",
      });
    });
  } catch (error) {
    next(error);
  }
}

