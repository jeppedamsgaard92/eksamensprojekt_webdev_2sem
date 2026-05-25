import { deleteUserById } from "../dataUtils/users.js";
import { deleteSurveyById } from "../dataUtils/surveys.js";
import { deleteCourseById } from "../dataUtils/onboarding.js";
import { auditLog } from "../utils/auditLogger.js";

export async function deleteOwnAccount(req, res, next) {
  try {
    const userId = req.session.user.id;

    await deleteSurveyById(userId);
    await deleteCourseById(userId);

    const userWasDeleted = await deleteUserById(userId);

    if (!userWasDeleted) {
      return res.status(404).json({
        success: false,
        message: "User was not found.",
      });
    }

    await auditLog({
      action: "DELETE_OWN_ACCOUNT",
      actorUserId: userId,
      targetUserId: userId,
    });

    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        success: true,
        message: "Your account and linked data were deleted.",
      });
    });
  } catch (error) {
    next(error);
  }
}