import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  createPost,
  findOrganizationWorkingUsers,
  getOrganizationPostById,
  getUserWorkingOrganizations,
  updatePost,
  findOrganizationRoles,
  findOrganizationMetaSchemas,
} from "@publiz/core";
import { useCurrentAppUser } from "../user";
import { useCheckOrganizationUser } from "./middleware";

import { zValidator } from "@hono/zod-validator";
import { createPostSchema, updatePostSchema } from "../post";

export const myOrganizationRouter = new Hono<AppEnv>();

myOrganizationRouter.get(
  "/",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const organizations = await getUserWorkingOrganizations(
      container,
      currentUser.id
    );
    return c.json({ data: organizations });
  }
);

myOrganizationRouter.get(
  "/:organization_id/roles",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const organizationRoles = await findOrganizationRoles(container, {
      organizationId: +organizationId,
    });
    return c.json({ data: organizationRoles });
  }
);

myOrganizationRouter.get(
  "/:organization_id/users",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const organizationUsers = await findOrganizationWorkingUsers(
      container,
      +organizationId
    );
    return c.json({ data: organizationUsers });
  }
);

myOrganizationRouter.get(
  "/:organization_id/meta_schemas",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const organizationUsers = await findOrganizationMetaSchemas(container, {
      organizationId: +organizationId,
    });
    return c.json({ data: organizationUsers });
  }
);

myOrganizationRouter.post(
  "/:organization_id/posts",
  zValidator("json", createPostSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const post = await createPost(container, {
      ...payload,
      authorId: currentUser.id,
      organizationId: +organizationId,
      type: "POST",
    });
    return c.json({ data: post });
  }
);

myOrganizationRouter.put(
  "/:organization_id/posts/:id",
  zValidator("json", updatePostSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const id = c.req.param("id");
    const container = c.get("container");
    const myPost = await getOrganizationPostById(
      container,
      currentUser.id,
      +id
    );
    const updatedPost = await updatePost(container, myPost.id, payload);
    return c.json({ data: updatedPost });
  }
);
