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
  uploadFile,
  getGcsImageServingUrl,
  createFile,
  getFileUrl,
  patchOrganizationMetadataById,
  deletePost,
  createTag,
  getTagById,
  getOrganizationTagById,
  deleteTagById,
  updateTag,
  findTagsByOrganizationId,
  findTaxonomiesByOrganizationId,
  createTaxonomy,
  getOrganizationTaxonomyById,
  deleteTaxonomyById,
  updateTaxonomy,
  createMetaSchema,
  updateMetaSchema,
  getOrganizationMetaSchemaById,
  findOrganizationAvailableMetaSchemas,
  findOrganizationAvailableTags,
  createComment,
  findCommentsByTargetAndTargetId,
  findByModelNameAndModelId,
  getOrganizationId,
  getOrganizationBySlug,
  getOrganizationById,
} from "@publiz/core";
import { useCurrentAppUser } from "../user";
import { useCheckOrganizationUser } from "./middleware";

import { zValidator } from "@hono/zod-validator";
import { createPostSchema, updatePostSchema } from "../post";
import { z } from "zod";
import { slugify } from "../lib/slugify";
import { normalizeMetadata } from "../lib/object";
import { getOrganizationIdFromCache } from "./lib";
import { getPostIdFromCache } from "../post/lib";
import { createCommentSchema } from "../comment/schema";
import { AppError } from "@publiz/core";

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
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );

    const organizationRoles = await findOrganizationRoles(container, {
      organizationId: organizationId,
    });
    return c.json({ data: organizationRoles });
  }
);

myOrganizationRouter.get(
  "/:organization_id",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );

    const organization = await getOrganizationById(container, organizationId);
    return c.json({ data: organization });
  }
);

myOrganizationRouter.get(
  "/:organization_id/users",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const organizationUsers = await findOrganizationWorkingUsers(
      container,
      organizationId
    );
    return c.json({ data: organizationUsers });
  }
);

myOrganizationRouter.get(
  "/:organization_id/meta_schemas",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const metaSchemas = await findOrganizationMetaSchemas(container, {
      organizationId: organizationId,
    });
    return c.json({ data: metaSchemas });
  }
);

myOrganizationRouter.get(
  "/:organization_id/applicable_meta_schemas",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const metaSchemas = await findOrganizationAvailableMetaSchemas(
      container,
      organizationId
    );
    return c.json({ data: metaSchemas });
  }
);

myOrganizationRouter.get(
  "/:organization_id/applicable_tags",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const metaSchemas = await findOrganizationAvailableTags(
      container,
      organizationId
    );
    return c.json({ data: metaSchemas });
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
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const post = await createPost(container, {
      ...payload,
      authorId: currentUser.id,
      organizationId,
      type: "POST",
    });
    return c.json({ data: post });
  }
);

myOrganizationRouter.put(
  "/:organization_id/posts/:post_id",
  zValidator("json", updatePostSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const payload = c.req.valid("json");
    const container = c.get("container");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const _verifyOrganizationPost = await getOrganizationPostById(
      container,
      organizationId,
      postId
    );
    const updatedPost = await updatePost(container, postId, payload);
    return c.json({ data: updatedPost });
  }
);

myOrganizationRouter.delete(
  "/:organization_id/posts/:post_id",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const container = c.get("container");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    await deletePost(container, postId);
    return c.body(null, 204);
  }
);

myOrganizationRouter.get(
  "/:organization_id/posts/:post_id",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const container = c.get("container");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const post = await getOrganizationPostById(
      container,
      organizationId,
      postId
    );
    return c.json({ data: post });
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
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
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
    const config = c.get("config");
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
      organizationId,
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
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );

    const updatedOrganization = await patchOrganizationMetadataById(
      container,
      organizationId,
      payload.metadata,
      payload.metaSchemaId
    );

    return c.json({ data: updatedOrganization });
  }
);

myOrganizationRouter.get(
  "/:organization_id/tags",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const tags = await findTagsByOrganizationId(container, organizationId);
    return c.json({ data: tags });
  }
);

const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  parentId: z.number().optional(),
  taxonomyId: z.number().optional(),
});

myOrganizationRouter.post(
  "/:organization_id/tags",
  zValidator("json", createTagSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const payload = c.req.valid("json");
    let parentTag = undefined;
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );

    if (payload.parentId) {
      parentTag = await getOrganizationTagById(
        container,
        organizationId,
        payload.parentId
      );
      // force taxonomyId to be the same as parent tag
      payload.taxonomyId = parentTag.taxonomyId;
    } else if (payload.taxonomyId) {
      const _verifyOrganizationTaxonomy = await getOrganizationTaxonomyById(
        container,
        organizationId,
        payload.taxonomyId
      );
    }

    const currentUser = c.get("currentAppUser");

    const tag = await createTag(container, {
      ...payload,
      type: "DEFAULT",
      userId: currentUser.id,
      organizationId: +organizationId,
    });
    return c.json({ data: tag }, 201);
  }
);

myOrganizationRouter.delete(
  "/:organization_id/tags/:id",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const id = c.req.param("id");
    const organizationTag = await getOrganizationTagById(
      container,
      +organizationId,
      +id
    );
    await deleteTagById(container, organizationTag.id);
    return c.body(null, 204);
  }
);

const updateTagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  parentId: z.number().optional(),
  taxonomyId: z.number().optional(),
});

myOrganizationRouter.put(
  "/:organization_id/tags/:id",
  zValidator("json", updateTagSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const id = c.req.param("id");
    const payload = c.req.valid("json");
    const organizationTag = await getOrganizationTagById(
      container,
      +organizationId,
      +id
    );
    let parentTag = undefined;
    if (payload.parentId) {
      parentTag = await getOrganizationTagById(
        container,
        organizationId,
        payload.parentId
      );
      // force taxonomyId to be the same as parent tag
      payload.taxonomyId = parentTag.taxonomyId;
    } else if (payload.taxonomyId) {
      const _verifyOrganizationTaxonomy = await getOrganizationTaxonomyById(
        container,
        organizationId,
        payload.taxonomyId
      );
    }
    const updatedTag = await updateTag(container, organizationTag.id, payload);
    return c.json({ data: updatedTag });
  }
);

myOrganizationRouter.get(
  "/:organization_id/taxonomies",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const taxonomies = await findTaxonomiesByOrganizationId(
      container,
      +organizationId
    );
    return c.json({ data: taxonomies });
  }
);

const createTaxonomySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

myOrganizationRouter.post(
  "/:organization_id/taxonomies",
  zValidator("json", createTaxonomySchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const payload = c.req.valid("json");
    const container = c.get("container");

    const currentUser = c.get("currentAppUser");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const taxonomy = await createTaxonomy(container, {
      ...payload,
      type: "DEFAULT",
      userId: currentUser.id,
      organizationId: +organizationId,
    });
    return c.json({ data: taxonomy }, 201);
  }
);

myOrganizationRouter.delete(
  "/:organization_id/taxonomies/:id",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const id = c.req.param("id");
    const organizationTag = await getOrganizationTaxonomyById(
      container,
      organizationId,
      +id
    );
    await deleteTaxonomyById(container, organizationTag.id);
    return c.body(null, 204);
  }
);

myOrganizationRouter.put(
  "/:organization_id/taxonomies/:id",
  zValidator("json", createTaxonomySchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const id = c.req.param("id");
    const payload = c.req.valid("json");
    const organizationTag = await getOrganizationTaxonomyById(
      container,
      organizationId,
      +id
    );

    const updatedTag = await updateTaxonomy(
      container,
      organizationTag.id,
      payload
    );
    return c.json({ data: updatedTag });
  }
);

const createMetaSchemaSchema = z.object({
  name: z.string().min(1).max(100),
  schema: z.object({}).passthrough(),
  target: z.enum(["post", "user", "organization", "file", "comment"]),
  version: z.number(),
  metadata: z.object({}).passthrough(),
});

myOrganizationRouter.post(
  "/:organization_id/meta_schemas",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser("Administrator"),
  zValidator("json", createMetaSchemaSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const metaSchema = await createMetaSchema(container, {
      ...payload,
      type: "DEFAULT",
      organizationId,
    });
    return c.json({ data: metaSchema }, 201);
  }
);

myOrganizationRouter.put(
  "/:organization_id/meta_schemas/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", createMetaSchemaSchema),
  async (c) => {
    const id = c.req.param("id");
    const payload = c.req.valid("json");
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const metaSchema = await getOrganizationMetaSchemaById(
      container,
      organizationId,
      +id
    );
    const updatedMetaSchema = await updateMetaSchema(
      container,
      metaSchema.id,
      payload
    );
    return c.json({ data: updatedMetaSchema });
  }
);

myOrganizationRouter.post(
  "/:organization_id/posts/:post_id/comments",
  zValidator("json", createCommentSchema),
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));

    const comment = await createComment(container, {
      ...payload,
      authorId: currentUser.id,
      target: "post",
      targetId: postId,
    });
    return c.json({ data: comment });
  }
);

myOrganizationRouter.get(
  "/:organization_id/posts/:post_id/comments",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const container = c.get("container");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const _verifyPostBelongToOrganization = await getOrganizationPostById(
      container,
      organizationId,
      postId
    );
    const comments = await findCommentsByTargetAndTargetId(
      container,
      "post",
      postId
    );
    return c.json({ data: comments });
  }
);

myOrganizationRouter.get(
  "/:organization_id/posts/:post_id/files",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const container = c.get("container");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );

    const _verifyPostBelongToOrganization = await getOrganizationPostById(
      container,
      organizationId,
      postId
    );
    const files = await findByModelNameAndModelId(
      container,
      "post",
      "" + postId
    );
    return c.json({ data: files });
  }
);
