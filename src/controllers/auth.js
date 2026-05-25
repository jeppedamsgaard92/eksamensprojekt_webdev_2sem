import { findCourseById } from "../dataUtils/onboarding.js";
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
    req.session.regenerate(async (error) => {
      if (error) {
        return next(error);
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const onboardingCourse = await findCourseById(req.session.user.id);

      res.status(200).json({
        success: true,
        message: "Login successful.",
        id: req.session.user.id,
        username: req.session.user.username,
        role: req.session.user.role,
        onboardingCourse: req.session.user.role === 'admin' ? undefined : onboardingCourse ? onboardingCourse.onboardingSlides : null
        //user: req.session.user,
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res) {
  const user = req.session.user;
  const onboardingCourse = await findCourseById(user.id);
  res.status(200).json({
    success: true,
    id: user.id,
    role: user.role,
    username: user.username,
    onboardingCourse: user.role === 'admin' ? undefined : onboardingCourse ? onboardingCourse.onboardingSlides : null
  });
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");

    res.status(200).json({
      success: true,
      message: "Logged out.",
    });
  });
}