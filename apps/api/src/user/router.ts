import { Hono } from "hono";
import { googleAccountLookUp } from "@fiboup/google-identify-toolkit";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "./middleware";
import { authorizationHeader, tokenPrefix } from "./constant";
import { withFirebaseConfig } from "../identity";
import { get } from "../lib/get";
import { AppError, Container, createUser } from "@publiz/core";

export const userRouter = new Hono<AppEnv>();

// this api is used to get the current user profile by the current auth token
// the auth token is issued by Auth provider (Firebase Auth)
// if the user is not registered on this system, we will create a new user
userRouter.get("/my_profile", useCurrentAppUser(), async (c) => {
  const currentAppUser = c.get("currentAppUser");
  if (!currentAppUser) {
    const tokenHeader = c.req.header(authorizationHeader) || "";
    const idToken = tokenHeader.substring(tokenPrefix.length);

    const firebaseAccount = await withFirebaseConfig(googleAccountLookUp)({
      idToken,
    });
    if (firebaseAccount.users.length === 0) {
      throw new AppError(
        500001,
        "This user is not registered on the auth system"
      );
    }

    const container = c.get("container") as Container;
    const localId = get(firebaseAccount, "users[0].localId");
    const newUser = await createUser(container, {
      authId: localId,
      displayName: "",
    });
    return c.json(newUser);
  }

  return c.json(currentAppUser);
});
