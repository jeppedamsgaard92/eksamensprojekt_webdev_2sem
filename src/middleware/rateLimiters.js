import rateLimit from "express-rate-limit";

//Begrænser brute force loginforsøg.
export const loginLimiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15 minutter
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many login attempts. Please try again later.",
  },
});

// Begrænser hvor mange invitationer en admin kan sende.
export const invitationLimiter = rateLimit({
  windowMs: 1000 * 60 * 60, // 1 time
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many invitations sent. Please try again later.",
  },
});