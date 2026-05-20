export function requirePendingRegistrationSession(req, res, next) {
  const hasPendingRegistrationSession =
    req.session.pendingRegistrationUserId &&
    req.session.pendingRegistrationTokenHash;

  if (!hasPendingRegistrationSession) {
    return res
      .status(403)
      .send("To register, you must have a valid registration link. Contact customer support.");
  }

  next();
}