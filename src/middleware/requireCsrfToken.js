import { hashToken } from "../utils/tokens.js";

//Verificerer at formularens CSRF-token matcher den token, der er knyttet til sessionen.
export function requireCsrfToken(req, res, next) {
  const csrfToken = req.body._csrf;

  //Requesten skal indeholde en CSRF-token.
  if (
    typeof csrfToken !== "string" ||
    csrfToken.trim() === ""
  ) {
    return res.status(403).json({
      message: "Invalid CSRF token.",
    });
  }

  //Sessionen skal indeholde en tilhørende CSRF-token-hash.
  if (!req.session.csrfTokenHash) {
    return res.status(403).json({
      message: "Invalid CSRF token.",
    });
  }

  //Den modtagne token hashes og sammenlignes med hash'en i sessionen.
  const csrfTokenHash = hashToken(csrfToken);

  if (csrfTokenHash !== req.session.csrfTokenHash) {
    return res.status(403).json({
      message: "Invalid CSRF token.",
    });
  }

  next();
}