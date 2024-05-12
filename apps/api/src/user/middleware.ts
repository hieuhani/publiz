import { AppError, Container, getMyProfile } from "@publiz/core";
import { MiddlewareHandler } from "hono";

type Options = {
  required: boolean;
};
const defaultOptions: Options = {
  required: false,
};
export const useCurrentAppUser = (
  options: Options = defaultOptions
): MiddlewareHandler => {
  return async (c, next) => {
    const currentUser = c.get("currentUser");
    if (!currentUser) {
      throw new AppError(401_001, "Unauthorized user");
    }
    const container = c.get("container") as Container;

    const appUser = await getMyProfile(container, { authId: currentUser.sub });

    if (options.required && !appUser) {
      throw new AppError(401_002, "Not found user on app database");
    }
    c.set("currentAppUser", appUser);
    await next();
    if (options.required) {
      c.header("Cache-Control", "private");
    }
  };
};
