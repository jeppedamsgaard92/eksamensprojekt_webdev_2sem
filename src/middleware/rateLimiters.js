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