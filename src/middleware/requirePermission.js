import { roles } from "../config/roles.js";

export function requirePermission(requiredPermission) {
  return function (req, res, next) {
    const role = req.session.user?.role;
    const permissions = roles[role]?.permissions ?? [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "You do not have permission to do this.",
      });
    }

    next();
  };
}