import "dotenv/config";
import express from "express";
import helmet from "helmet";
import session from "express-session";
import cors from 'cors';

import registrationRoutes from "./routes/registrations.js";
import onboardingRoutes from "./routes/onboarding.js";
import csrfRoutes from "./routes/csrf.js";
import authRoutes from "./routes/auth.js";

const app = express();

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Sæt CORS til at tillade alt (skal ligge FØR dine ruter!)
app.use(cors({
  origin: true, // Tillader alle domæner/URL'er (f.eks. både localhost:5500, localhost:5173 osv.)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Tillader alle gængse HTTP-metoder
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Tillader de vigtigste headers
}));

/*
  Jeg vil ikke starte serveren, hvis SESSION_SECRET mangler.
  Session-secret bruges til at signere session-cookien, så den ikke kan manipuleres.
*/
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET mangler i .env");
}

/*
  Express sender som udgangspunkt headeren:
  X-Powered-By: Express

  Jeg slår den fra, så serveren ikke unødigt fortæller,
  hvilket framework den kører på.
*/
app.disable("x-powered-by");

/*
  Hvis appen senere kører bag en reverse proxy i produktion,
  fx på en hostingplatform, skal Express kunne forstå,
  at den oprindelige forbindelse var HTTPS.

  Det er især vigtigt, når session-cookies bruger secure: true.
*/
if (isProduction) {
  app.set("trust proxy", 1);
}

/*
  Helmet sætter en række sikkerhedsheaders.

  Jeg tilpasser CSP'en allerede nu:
  - kun egne scripts
  - kun egne styles
  - ingen <object>-indhold
  - siden må ikke lægges i en iframe
  - formularer må kun sende til samme origin

  upgradeInsecureRequests er slået fra lokalt,
  da det ellers kan give problemer med localhost over HTTP.
*/
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },

    /*
      HSTS giver kun mening over rigtig HTTPS.
      Derfor slår jeg det først til i produktion.
    */
    strictTransportSecurity: isProduction
      ? {
        maxAge: 31536000,
        includeSubDomains: true,
      }
      : false,
  })
);

/*
  Jeg gør serveren klar til både:
  - JSON requests
  - almindelige HTML-formularer

  Jeg sætter samtidig en lille størrelsesgrænse,
  fordi login- og setup-data bør være meget små.
  Det reducerer risikoen for unødigt store requests.
*/
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

/*
  Sessioner skal vi bruge i vores førstegangs-login-flow.

  Eksempel:
  Når default login er korrekt, kan vi senere gemme:
  req.session.pendingSetupUserId = user.id;

  Det betyder ikke, at brugeren er fuldt logget ind.
  Det betyder kun, at vedkommende er i gang med setup-flowet.
*/
app.use(
  session({
    /*
      Secret bruges til at signere session-cookien.
      Den ligger i .env og ikke direkte i koden.
    */
    secret: process.env.SESSION_SECRET,

    /*
      Jeg gemmer ikke sessionen igen ved hver eneste request,
      hvis den ikke er ændret.
    */
    resave: false,

    /*
      Jeg opretter ikke tomme sessioner for besøgende,
      der bare åbner siden uden at gøre noget.
    */
    saveUninitialized: false,

    cookie: {
      /*
        JavaScript i browseren må ikke kunne læse session-cookien.
        Det hjælper mod tyveri af session-ID via XSS.
      */
      httpOnly: true,

      /*
        I produktion skal session-cookien kun sendes over HTTPS.
        Lokalt bruger vi HTTP, så her må den ikke være true endnu.
      */
      secure: isProduction,

      /*
        SameSite: "lax" reducerer risikoen for,
        at session-cookien sendes med cross-site requests.
        Det er ikke en fuld CSRF-løsning, men et nyttigt ekstra lag.
      */
      sameSite: "lax",

      /*
        Sessionen udløber efter 30 minutter uden hensyn til browserlukning.
        Det er et fornuftigt udgangspunkt til login-systemet.
      */
      maxAge: 1000 * 60 * 30,
    },
  })
);



/*
  Registreringsflowets routes.
*/
app.use("/register", registrationRoutes);

/*
  Onboarding routes.
*/
app.use("/onboarding", onboardingRoutes);

/*
  CSRF routes.
*/
app.use("/csrf", csrfRoutes);

app.use("/auth", authRoutes);

/*
  Midlertidig test-route.
  Når den virker, ved jeg, at serveren starter korrekt.
*/
app.get("/", (req, res) => {
  res.status(200).send("Serveren kører.");
});

/*
  Hvis brugeren rammer en route, der ikke findes,
  sender jeg en enkel 404-besked.
*/
app.use((req, res) => {
  res.status(404).send("Siden blev ikke fundet.");
});

/*
  Central fejlhåndtering.

  Jeg logger den rigtige fejl i terminalen,
  men sender ikke stack traces eller interne detaljer til brugeren.
*/
app.use((error, req, res, next) => {
  console.error("Serverfejl:", error);

  res.status(500).send("Der opstod en serverfejl.");
});

// starter serveren
app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`);
});