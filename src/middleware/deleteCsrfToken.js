// Sletter CSRF-token-hash fra sessionen, så tokenen ikke kan genbruges.
export function deleteCsrfToken(req, res, next) {
  delete req.session.csrfTokenHash;
  next();
}