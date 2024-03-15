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
  getPostComments,
  uploadFile,
  getGcsImageServingUrl,
  createFile,
  getFileUrl,
  patchOrganizationMetadataById,
} from "@publiz/core";
import { useCurrentAppUser } from "../user";
import { useCheckOrganizationUser } from "./middleware";

import { zValidator } from "@hono/zod-validator";
import { createPostSchema, updatePostSchema } from "../post";
import { z } from "zod";
import { slugify } from "../lib/slugify";
import { config } from "../config";
import { normalizeMetadata } from "../lib/object";

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
    const id = c.req.param("id");
    const container = c.get("container");
    const organizationId = c.req.param("organization_id");
    const myPost = await getOrganizationPostById(
      container,
      +organizationId,
      +id
    );
    const updatedPost = await updatePost(container, myPost.id, payload);
    return c.json({ data: updatedPost });
  }
);

myOrganizationRouter.get(
  "/:organization_id/posts/:id",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const id = c.req.param("id");
    const container = c.get("container");
    const organizationId = c.req.param("organization_id");
    const post = await getOrganizationPostById(container, +organizationId, +id);
    return c.json({ data: post });
  }
);

myOrganizationRouter.get(
  "/:organization_id/posts/:id/comments",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const id = c.req.param("id");
    const container = c.get("container");
    // this function guarantees that this post is from the organization
    const myPost = await getOrganizationPostById(
      container,
      currentUser.id,
      +id
    );

    const comments = await getPostComments(container, myPost.id);

    return c.json({ data: comments });
  }
);

const uploadFileSchema = z.object({
  file: z.instanceof(File),
  metadata: z.string().optional(),
  type: z.enum(["avatar", "cover"]),
});

myOrganizationRouter.patch(
  "/:organization_id/image",
  zValidator("form", uploadFileSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const { file, metadata: formMetadata, type } = c.req.valid("form");
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image file");
    }

    const modelName = "organization";
    const modelId = organizationId;
    const fileName = slugify(file.name);
    const key = [modelName, modelId, `${type}-${Date.now()}-${fileName}`]
      .filter(Boolean)
      .join("/");

    const rawMetadata = formMetadata ? JSON.parse(formMetadata) : {};
    const metadata = Object.assign({}, rawMetadata, {
      userId: currentUser.id,
      modelName,
      modelId,
    });
    if (!metadata.size) {
      metadata.size = file.size;
    }

    const fileBuffer = await file.arrayBuffer();
    await uploadFile(container, {
      bucket: config.s3.bucket,
      key,
      body: fileBuffer as any,
      metadata: normalizeMetadata(metadata),
    });
    const imageServingEndpoint = config.s3.getGcsImageServingEndpoint;
    if (imageServingEndpoint) {
      metadata.gcsImageServingUrl = await getGcsImageServingUrl({
        bucket: config.s3.bucket,
        key,
        endpoint: imageServingEndpoint,
      });
    }

    const imageFile = await createFile(container, {
      contentType: file.type,
      fileName,
      bucket: config.s3.bucket,
      filePath: key,
      metadata,
      userId: currentUser.id,
    });
    const fileUrl = await getFileUrl(container, imageFile);
    const imageMeta = {
      ...rawMetadata,
      src: fileUrl,
    };
    const updatedOrganization = await patchOrganizationMetadataById(
      container,
      +organizationId,
      { [type]: imageMeta }
    );

    return c.json({ data: updatedOrganization });
  }
);

const updateOrganizationMetadataSchema = z.object({
  metadata: z.object({}).passthrough(),
  metaSchemaId: z.number(),
});

myOrganizationRouter.patch(
  "/:organization_id/metadata",
  zValidator("json", updateOrganizationMetadataSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const payload = c.req.valid("json");
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");

    const updatedOrganization = await patchOrganizationMetadataById(
      container,
      +organizationId,
      payload.metadata,
      payload.metaSchemaId
    );

    return c.json({ data: updatedOrganization });
  }
);
