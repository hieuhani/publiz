import { Hono } from "hono";
import { validateFirebaseAuth } from "@fiboup/hono-firebase-auth";
import { useDi } from "./di";
import { AppEnv } from "./global";
import { config } from "./config";
import { globalErrorHandler } from "./error";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { tagRouter, myTagRouter } from "./tag";
import { requireAdmin } from "./admin/middleware";
import { adminTagRouter } from "./admin";
import { myPostRouter } from "./post/my-post-router";
import { myFileRouter } from "./file";

const app = new Hono<AppEnv>();

app.use("*", useDi());
app.use(
  "*",
  validateFirebaseAuth({
    projectId: config.firebase.projectId,
  })
);

// auth api
app.route("/api/v1/auth", authRouter);

// users api
app.route("/api/v1/users", userRouter);

// tags api
app.route("/api/v1/tags", tagRouter);
app.route("/api/v1/my_tags", myTagRouter);

// files api
app.route("/api/v1/my_files", myFileRouter);

// post api
app.route("/api/v1/my_posts", myPostRouter);

// admin api
app.use("/admin/*", requireAdmin());
app.route("/admin/api/v1/tags", adminTagRouter);

app.onError(globalErrorHandler);

export default app;
