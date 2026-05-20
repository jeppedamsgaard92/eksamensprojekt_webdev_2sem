import { hashToken } from "../utils/tokens.js";

export function requireCsrfToken(req, res, next) {
  // Henter CSRF-token fra enten HTML-formular eller frontend request-header.
  const csrfToken = req.body._csrf || req.get("x-csrf-token");

  // Stopper requesten, hvis token mangler eller ikke er tekst.
  if (typeof csrfToken !== "string" || csrfToken.trim() === "") {
    return res.status(403).json({
      message: "Invalid CSRF token.",
    });
  }

  // Stopper requesten, hvis sessionen ikke har en token-hash at sammenligne med.
  if (!req.session.csrfTokenHash) {
    return res.status(403).json({
      message: "Invalid CSRF token.",
    });
  }

  // Hasher den modtagne token, så den kan sammenlignes med sessionens hash.
  const csrfTokenHash = hashToken(csrfToken);

  // Stopper requesten, hvis tokenen ikke matcher sessionens CSRF-token.
  if (csrfTokenHash !== req.session.csrfTokenHash) {
    return res.status(403).json({
      message: "Invalid CSRF token.",
    });
  }

  // Tokenen er gyldig, så næste middleware/controller må køre.
  next();
}