import { loginUser } from "../services/auth.js";

export async function requireReauthentication(req, res, next) {
  try {
    const { username, password } = req.body;
    const sessionUserId = req.session.user.id;

    const result = await loginUser({ username, password });

    if (!result.success || result.user.id !== sessionUserId) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}