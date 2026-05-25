import { deleteUserById } from "../dataUtils/users.js";
import { deleteSurveyById } from "../dataUtils/surveys.js";
import { deleteCourseById } from "../dataUtils/onboarding.js";
import { auditLog } from "../utils/auditLogger.js";
import { findUserByEmail, updateUserById } from "../dataUtils/users.js";
import { hashPassword } from "../utils/passwords.js";

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

export async function updateOwnAccount(req, res, next) {
  try {
    const userId = req.session.user.id;
    const { name, email } = req.validatedData;

    const updates = {};

    if (name !== undefined) {
      updates.name = name;
    }

    if (email !== undefined) {
      const existingUserWithEmail = await findUserByEmail(email);

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another account.",
        });
      }

      updates.email = email;
    }

    const updatedUser = await updateUserById(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User was not found.",
      });
    }

    await auditLog({
      action: "UPDATE_OWN_ACCOUNT",
      actorUserId: userId,
      targetUserId: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Your account was updated.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOwnPassword(req, res, next) {
  try {
    const userId = req.session.user.id;
    const { newPassword } = req.validatedData;

    const passwordHash = await hashPassword(newPassword);

    const updatedUser = await updateUserById(userId, {
      passwordHash,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User was not found.",
      });
    }

    await auditLog({
      action: "UPDATE_OWN_PASSWORD",
      actorUserId: userId,
      targetUserId: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Your password was updated.",
    });
  } catch (error) {
    next(error);
  }
}