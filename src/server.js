import "dotenv/config";
import express from "express";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";

import registrationRoutes from "./routes/registrations.js";
import onboardingRoutes from "./routes/onboarding.js";
import csrfRoutes from "./routes/csrf.js";
import authRoutes from "./routes/auth.js";
import surveyRoutes from "./routes/survey.js";
import clientsRoutes from "./routes/clients.js";
import accountRoutes from "./routes/account.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // Gør det muligt at finde filens sti i ES modules.
const __dirname = path.dirname(__filename); // Finder mappen som server.js ligger i.

const app = express(); // Opretter Express-app'en.

const PORT = process.env.PORT || 2000; // Bruger port fra .env eller fallback til 2000.
const isProduction = process.env.NODE_ENV === "production"; // Bruges til at skelne udvikling fra produktion.

app.use(
  cors({
    origin: true, // Tillader requests fra andre origins, fx Vue-dev-server eller localhost.
    credentials: true, // Tillader cookies/sessioner at blive sendt med cross-origin requests.
  })
);

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET mangler i .env"); // Stopper serveren, hvis session-secret mangler.
}

app.disable("x-powered-by"); // Skjuler at serveren kører Express. ( express sender som udgangspunkt headeren: X-Powered-By: Express)

if (isProduction) {
  app.set("trust proxy", 1); // Gør secure cookies mulige bag fx en hosting-proxy.
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Tillader som udgangspunkt kun ressourcer fra egen origin.
        scriptSrc: ["'self'"], // Tillader kun JavaScript-filer fra egen origin.
        styleSrc: ["'self'"], // Tillader kun CSS fra egen origin.
        imgSrc: ["'self'", "data:"], // Tillader egne billeder og data-URI billeder.
        connectSrc: ["'self'"], // Tillader fetch/XHR/WebSocket til egen origin.
        objectSrc: ["'none'"], // Blokerer object/embed-indhold.
        baseUri: ["'self'"], // Forhindrer manipulation af base-URL.
        formAction: ["'self'"], // Formularer må kun sende til egen origin.
        frameAncestors: ["'none'"], // Forhindrer at siden indlejres i iframe.
        upgradeInsecureRequests: isProduction ? [] : null, // Opgraderer HTTP til HTTPS i produktion, men ikke lokalt.
      },
    },

    strictTransportSecurity: isProduction
      ? {
          maxAge: 31536000, // Browseren husker HTTPS-krav i 1 år.
          includeSubDomains: true, // HTTPS-kravet gælder også subdomæner.
        }
      : false, // HSTS slås fra lokalt, fordi localhost typisk bruger HTTP.  HSTS giver kun mening over rigtig HTTPS.
  })
);

app.use(express.json({ limit: "10kb" })); // Parser JSON-body og begrænser request-størrelse.
app.use(express.urlencoded({ extended: false, limit: "10kb" })); // Parser HTML-formularer og begrænser request-størrelse.

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Signerer session-cookien, så den ikke kan manipuleres.
    resave: false, // Gemmer ikke sessionen igen, hvis den ikke er ændret.
    saveUninitialized: false, // Opretter ikke tomme sessioner for anonyme besøgende.

    cookie: {
      httpOnly: true, // Forhindrer JavaScript i browseren i at læse session-cookien.
      secure: isProduction, // Kræver HTTPS i produktion, men tillader HTTP lokalt.
      sameSite: "lax", // Reducerer risikoen for CSRF ved cross-site requests.
      maxAge: 1000 * 60 * 30, // Sessionen udløber efter 30 minutter.
    },
  })
);

app.use(express.static(path.join(__dirname, "public"))); // Server statiske filer fra public-mappen.

app.get("/registration-success", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/registration-success.html")
  ); // Sender success-siden efter færdig registrering.
});

app.use("/register", registrationRoutes); // Routes til registreringsflowet.
app.use("/onboarding", onboardingRoutes); // Routes til onboarding, slides, links og invitationer.
app.use("/survey", surveyRoutes); // Routes til survey-spørgsmål og survey-besvarelser.
app.use("/csrf", csrfRoutes); // Route til at hente CSRF-token.
app.use("/auth", authRoutes); // Routes til login, logout og current user.
app.use("/clients", clientsRoutes); // Routes til admin-håndtering af klienter.
app.use("/account", accountRoutes); // Routes til brugerens egen konto.

app.use((req, res) => {
  res.status(404).send("Siden blev ikke fundet."); // Fanger requests til routes, der ikke findes.
});

app.use((error, req, res, next) => {
  console.error("Serverfejl:", error); // Logger den rigtige fejl i terminalen.

  res.status(500).json({
    message: "Der opstod en serverfejl.",
  }); // Sender generisk fejlbesked til klienten.
});

app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`); // Starter serveren.
});