export function requireAuth(req, res, next) {
  // Brugeren skal have en aktiv login-session.
  if (!req.session.user) {
    return res.status(401).json({
      message: "You must be logged in.",
    });
  }

  next();
}