import { loginUser } from "../services/auth.js";

export async function login(req, res, next) {
  try {
    const { username, password } = req.validatedData;

    const result = await loginUser({ username, password });

    if (!result.success) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const { user } = result;

    // Regenererer session-ID ved login for at modvirke session fixation.
    req.session.regenerate((error) => {
    if (error) {
        return next(error);
    }

    req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
    };

    res.status(200).json({
        message: "Login successful.",
        user: req.session.user,
    });
    });
  } catch (error) {
    next(error);
  }
}

export function getCurrentUser(req, res) {
  res.status(200).json({
    user: req.session.user,
  });
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");

    res.status(200).json({
      message: "Logged out.",
    });
  });
}