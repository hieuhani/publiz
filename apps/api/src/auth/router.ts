import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { type AppEnv } from "../global";
import { withFirebaseConfig } from "../identity";
import { googleAccountSignInWithPassword } from "@fiboup/google-identify-toolkit";

export const authRouter = new Hono<AppEnv>();

const updateProfileSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/v1/auth/sign_in
// this api calls firebase auth to sign in with email and password
// to get the access idToken
authRouter.post(
  "/sign_in",
  zValidator("json", updateProfileSchema),
  async (c) => {
    const signInPayload = c.req.valid("json");
    const authResponse = await withFirebaseConfig(
      googleAccountSignInWithPassword
    )({ ...signInPayload, returnSecureToken: true });
    return c.json({ data: authResponse });
  }
);
