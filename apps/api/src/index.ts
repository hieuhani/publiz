import { Hono } from "hono";
import { userRouter } from "./user/router";
import { useDi } from "./di";
import { validateFirebaseAuth } from "@fiboup/hono-firebase-auth";
import { AppEnv } from "./global";
import { config } from "./config";
import { authRouter } from "./auth/router";
import { globalErrorHandler } from "./error";

const app = new Hono<AppEnv>();

app.use("*", useDi());
app.use(
  "*",
  validateFirebaseAuth({
    projectId: config.firebase.projectId,
  })
);

app.route("/api/v1/auth", authRouter);
app.route("/api/v1/users", userRouter);

app.onError(globalErrorHandler);

export default app;
