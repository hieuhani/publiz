import { Hono } from "hono";
import { cors } from "hono/cors";
import { validateFirebaseAuth } from "@fiboup/hono-firebase-auth";
import { useDi } from "./di";
import { AppEnv } from "./global";
import { config } from "./config";
import { globalErrorHandler } from "./error";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { tagRouter, myTagRouter } from "./tag";
import {
  adminOrganizationRouter,
  adminTagRouter,
  adminUserRouter,
  adminMetaSchemaRouter,
  requireAdmin,
} from "./admin";
import { myPostRouter } from "./post/my-post-router";
import { myFileRouter } from "./file";
import { myOrganizationRouter, organizationRouter } from "./organization";
import { metaSchemaRouter } from "./meta-schema";
import { postRouter } from "./post";

const app = new Hono<AppEnv>();
const corsMiddleware = cors(config.cors);

app.use("*", useDi());
app.use(
  "*",
  validateFirebaseAuth({
    projectId: config.firebase.projectId,
  })
);

app.use("/api/*", corsMiddleware);
app.use("/admin/api/*", corsMiddleware);

app.get("/", (c) => c.json({ data: "ok" }));

// auth api
app.route("/api/v1/auth", authRouter);

// users api
app.route("/api/v1/users", userRouter);

// tags api
app.route("/api/v1/tags", tagRouter);
app.route("/api/v1/my_tags", myTagRouter);

// meta schemas api
app.route("/api/v1/meta_schemas", metaSchemaRouter);

// files api
app.route("/api/v1/my_files", myFileRouter);

// post api
app.route("/api/v1/my_posts", myPostRouter);
app.route("/api/v1/posts", postRouter);

// organizations api
app.route("/api/v1/organizations", organizationRouter);
app.route("/api/v1/my_organizations", myOrganizationRouter);

// admin api
app.use("/admin/*", requireAdmin());
app.route("/admin/api/v1/tags", adminTagRouter);
app.route("/admin/api/v1/organizations", adminOrganizationRouter);
app.route("/admin/api/v1/meta_schemas", adminMetaSchemaRouter);
app.route("/admin/api/v1/users", adminUserRouter);
app.onError(globalErrorHandler);

export default app;
