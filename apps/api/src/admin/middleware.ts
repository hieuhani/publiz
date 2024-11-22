import {
  AppError,
  Container,
  getMyProfile,
  RoleAdministrator,
  verifyUserRoleOrThrow,
} from "@publiz/core";
import { MiddlewareHandler } from "hono";

export const requireAdmin = (): MiddlewareHandler => {
  return async (c, next) => {
    const currentUser = c.get("currentUser");
    if (!currentUser) {
      throw new AppError(401_001, "Unauthorized user");
    }
    const container = c.get("container") as Container;

    const appUser = await getMyProfile(container, { authId: currentUser.sub });

    if (!appUser) {
      throw new AppError(403_002, "Not found user");
    }

    await verifyUserRoleOrThrow(container, appUser, RoleAdministrator);

    await next();
  };
};
