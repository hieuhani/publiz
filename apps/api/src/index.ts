import { Hono } from "hono";
import { userRouter } from "./user/router";
import { useDi } from "./di";
import { validateFirebaseAuth } from "@fiboup/hono-firebase-auth";
import { AppEnv } from "./global";

const app = new Hono<AppEnv>();

app.use("*", useDi());
app.use("*", async (c, next) => {
  return validateFirebaseAuth({
    projectId: c.env.FIREBASE_PROJECT_ID!,
  })(c, next);
});

app.route("/api/v1/users", userRouter);

export default app;
