import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
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
  adminCollectionRouter,
} from "./admin";
import { myPostRouter } from "./post/my-post-router";
import { myFileRouter } from "./file";
import { myOrganizationRouter, organizationRouter } from "./organization";
import { metaSchemaRouter } from "./meta-schema";
import { postRouter } from "./post";
import { adminPostRouter } from "./admin/post-router";
import { adminTaxonomyRouter } from "./admin/taxonomy-router";
import { taxonomyRouter } from "./taxonomy";
import { collectionRouter } from "./collection/router";
import { adminReactionPackRouter } from "./admin/reaction-pack-router";
import { moderatingPostRouter } from "./post/moderating-post-router";
import { systemRouter } from "./system/router";

export type AppConfig = {
  db?: any;
};
const createApp = ({ db }: AppConfig = {}) => {
  const app = new Hono<AppEnv>();

  app.use(timing());
  app.use(logger());
  app.use(
    "*",
    useDi({
      sqlDb: db,
    })
  );

  app.use("*", (c, next) =>
    validateFirebaseAuth({
      projectId: c.get("config").firebase.projectId,
    })(c, next)
  );

  app.use("/api/*", (c, next) => cors(c.get("config").cors as any)(c, next));
  app.use(
    "/api/*",
    etag({
      weak: true,
    })
  );
  app.use("/admin/api/*", (c, next) =>
    cors(c.get("config").cors as any)(c, next)
  );

  app.get("/api", (c) => c.json({ data: "ok" }));

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

  app.route("/api/v1/moderating_posts", moderatingPostRouter);

  // organizations api
  app.route("/api/v1/organizations", organizationRouter);
  app.route("/api/v1/my_organizations", myOrganizationRouter);

  // collections api
  app.route("/api/v1/collections", collectionRouter);

  // admin api
  app.use("/api/admin/*", requireAdmin());
  app.route("/api/admin/v1/tags", adminTagRouter);
  app.route("/api/admin/v1/organizations", adminOrganizationRouter);
  app.route("/api/admin/v1/meta_schemas", adminMetaSchemaRouter);
  app.route("/api/admin/v1/users", adminUserRouter);
  app.route("/api/admin/v1/posts", adminPostRouter);
  app.route("/api/admin/v1/taxonomies", adminTaxonomyRouter);
  app.route("/api/admin/v1/collections", adminCollectionRouter);
  app.route("/api/admin/v1/reaction_packs", adminReactionPackRouter);

  app.route("/api/system", systemRouter);

  app.onError(globalErrorHandler);

  return app;
};

export { createApp };
export default createApp;
