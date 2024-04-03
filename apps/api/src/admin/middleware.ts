import { AppError } from "@publiz/core";
import { MiddlewareHandler } from "hono";
import { Config } from "../config";

export const requireAdmin = (): MiddlewareHandler => {
  return async (c, next) => {
    const currentUser = c.get("currentUser");
    if (!currentUser) {
      throw new AppError(401_001, "Unauthorized user");
    }
    const config = c.get("config") as Config;
    if (!config.admin.authIds.includes(currentUser.sub)) {
      throw new AppError(403_002, "You are not an admin");
    }
    await next();
  };
};
