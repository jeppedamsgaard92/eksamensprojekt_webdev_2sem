import { verifyRegistrationToken, completeUserRegistration, } from "../services/registrations.js";
import { generateCsrfToken, hashToken, } from "../utils/tokens.js";
/*
  Hvis tokenen er gyldig:
  - oprettes en ny registrerings-session
  - bindes sessionen til den konkrete bruger
  - redirecter til /register uden token i URL'en
*/
export async function activateRegistration(req, res, next) {
  try {
    const { token } = req.query; //tager token fra linket, som brugeren åbner i emailen
    const verifiedRegistration = await verifyRegistrationToken(token); //får bruger og tilhørende tokenhash

    if (!verifiedRegistration) {
      return res
        .status(400)
        .send("The link to register is either invalid or expired. Contact customer support.");
    }

    const { user, registrationTokenHash, } = verifiedRegistration;

    // Nu har vi fundet ud af, at linket er gyldigt, så vi regenererer session-ID'et, når brugeren går fra almindelig anonym besøgende til en browser, der må færdiggøre registrering for en konkret invitation.
    // Det reducerer risikoen for session fixation.
    
    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      //nu oprettes "pendingRegistrationUserId" på sessionen, så vi senere kan validere, at det er den oprindelige ejermand af tokenet, der opretter sig som bruger
      req.session.pendingRegistrationUserId = user.id;

      //Gemmer også token-hash'en i sessionen. Når brugeren senere sender brugernavn og kodeord, kan det kontrolleres, at det stadig er den samme invitation, der ligger bag registreringen.
      req.session.pendingRegistrationTokenHash = registrationTokenHash;

      //Sessionen gemmes eksplicit før redirect. express gemmer automatisk, men bare for at sikre at den gemmer før den redirecter til /register. Better safe than sorry..
      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }
        //Brugeren sendes videre til register.
        res.redirect("http://localhost:5173/register");
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

