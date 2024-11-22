import { Hono } from "hono";
import { AppEnv } from "../global";
import {
  AppError,
  createUser,
  executeInitialMigration,
  getDatabaseMigrations,
  getUsersCount,
  UserRoleAdministrator,
} from "@publiz/core";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  googleAccountSignInWithPassword,
  googleAccountSignUp,
} from "@fiboup/google-identify-toolkit";

export const systemRouter = new Hono<AppEnv>();

systemRouter.get("/database_migrations", async (c) => {
  const migrations = await getDatabaseMigrations(c.get("container"));
  return c.json({ data: migrations });
});

systemRouter.get("/database_migrations/initial_database", async (c) => {
  await executeInitialMigration(c.get("container"));
  return c.json({ data: {} });
});

const signUpWithEmailSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

systemRouter.post(
  "/sign_up_admin_user",
  zValidator("json", signUpWithEmailSchema),
  async (c) => {
    const signInPayload = c.req.valid("json");
    const config = c.get("config");
    const container = c.get("container");
    const usersCount = await getUsersCount(container);
    if (usersCount > 0) {
      throw new AppError(400401, "Admin user can only register once");
    }
    try {
      const authResponse = await googleAccountSignUp(
        config.firebase,
        signInPayload
      );

      const _newUser = await createUser(container, {
        authId: authResponse.localId,
        displayName: "",
        rolesMask: UserRoleAdministrator,
      });

      return c.json({ data: authResponse });
    } catch (error: any) {
      if (error.response.error.message === "EMAIL_EXISTS") {
        const authResponse = await googleAccountSignInWithPassword(
          config.firebase,
          {
            ...signInPayload,
            returnSecureToken: true,
          }
        );

        const newUser = await createUser(container, {
          authId: authResponse.localId,
          displayName: "",
          rolesMask: UserRoleAdministrator,
        });
        return c.json({ data: authResponse });
      }

      return error.getResponse();
    }
  }
);
