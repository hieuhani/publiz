import { Hono } from "hono";
import { cors } from "hono/cors";
import { cache } from "hono/cache";
import { timing } from "hono/timing";

import { validateFirebaseAuth } from "@fiboup/hono-firebase-auth";
import { etag } from "hono/etag";
import { useDi } from "./di";
import { AppEnv } from "./global";
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
import { adminPostRouter } from "./admin/post-router";
import { adminTaxonomyRouter } from "./admin/taxonomy-router";
import { taxonomyRouter } from "./taxonomy";

const app = new Hono<AppEnv>();

app.use(timing());
app.use("*", useDi());

app.get(
  "/api/*",
  cache({
    cacheName: "publiz",
    cacheControl: "max-age=3600",
  })
);

app.use("*", (c, next) =>
  validateFirebaseAuth({
    projectId: c.get("config").firebase.projectId,
  })(c, next)
);

app.use("/api/*", (c, next) => cors(c.get("config").cors)(c, next));
app.use("/api/*", etag());
app.use("/admin/api/*", (c, next) => cors(c.get("config").cors)(c, next));

app.get("/", (c) => c.json({ data: "ok" }));

// auth api
app.route("/api/v1/auth", authRouter);

// users api
app.route("/api/v1/users", userRouter);

// tags api
app.route("/api/v1/tags", tagRouter);
app.route("/api/v1/my_tags", myTagRouter);

// taxonomies api
app.route("/api/v1/taxonomies", taxonomyRouter);

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
app.route("/admin/api/v1/posts", adminPostRouter);
app.route("/admin/api/v1/taxonomies", adminTaxonomyRouter);
app.onError(globalErrorHandler);

export default app;
