import { Hono } from "hono";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "./middleware";
import { authorizationHeader, tokenPrefix } from "./constant";

export const userRouter = new Hono<AppEnv>();

userRouter.get("/my_profile", useCurrentAppUser(), async (c) => {
  const currentAppUser = c.get("currentAppUser");
  if (!currentAppUser) {
    const tokenHeader = c.req.header(authorizationHeader) || "";
    const idToken = tokenHeader.substring(tokenPrefix.length);
  }

  return c.json(currentAppUser);
});
