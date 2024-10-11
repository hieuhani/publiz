import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { type AppEnv } from "../global";
import {
  googleAccountSignInWithPassword,
  googleAccountSignUp,
  googleExchangeToken,
} from "@fiboup/google-identify-toolkit";

export const authRouter = new Hono<AppEnv>();

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/v1/auth/sign_in
// this api calls firebase auth to sign in with email and password
// to get the access idToken
authRouter.post("/sign_in", zValidator("json", signInSchema), async (c) => {
  const signInPayload = c.req.valid("json");
  const config = c.get("config");
  try {
    const authResponse = await googleAccountSignInWithPassword(
      config.firebase,
      {
        ...signInPayload,
        returnSecureToken: true,
      }
    );
    return c.json({ data: authResponse });
  } catch (error: any) {
    return error.getResponse();
  }
});

const signUpWithEmailSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post(
  "/sign_up_with_email",
  zValidator("json", signUpWithEmailSchema),
  async (c) => {
    const signInPayload = c.req.valid("json");
    const config = c.get("config");
    try {
      const authResponse = await googleAccountSignUp(
        config.firebase,
        signInPayload
      );
      return c.json({ data: authResponse });
    } catch (error: any) {
      return error.getResponse();
    }
  }
);

const refreshTokenSchema = z.object({
  token: z.string(),
});

authRouter.post(
  "/refresh_token",
  zValidator("json", refreshTokenSchema),
  async (c) => {
    const refreshTokenPayload = c.req.valid("json");
    const config = c.get("config");
    try {
      const authResponse = await googleExchangeToken(config.firebase, {
        refresh_token: refreshTokenPayload.token,
        grant_type: "refresh_token",
      });
      return c.json({
        data: {
          idToken: authResponse.id_token,
          refreshToken: authResponse.refresh_token,
          expiresIn: authResponse.expires_in,
          localId: authResponse.user_id,
        },
      });
    } catch (error: any) {
      return error.getResponse();
    }
  }
);
