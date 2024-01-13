import { Hono } from "hono";
import { validateFirebaseAuth } from "@fiboup/hono-firebase-auth";
import { useDi } from "./di";
import { AppEnv } from "./global";
import { config } from "./config";
import { globalErrorHandler } from "./error";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { tagRouter, myTagRouter } from "./tag";

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
app.route("/api/v1/tags", tagRouter);
app.route("/api/v1/my_tags", myTagRouter);

app.onError(globalErrorHandler);

export default app;
