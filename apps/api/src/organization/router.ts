import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  getOrganizations,
  findPostsByOrganizationId,
  getOrganizationById,
  findOrganizationRelatedTags,
  AppError,
  getMetaSchemaByIdentifier,
  findPosts,
} from "@publiz/core";

export const organizationRouter = new Hono<AppEnv>();

organizationRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await getOrganizations(container);
  return c.json({ data: tags }); // reserved for pagination
});

organizationRouter.get("/:organization_id/posts", async (c) => {
  const id = c.req.param("organization_id");
  const container = c.get("container");
  const organization = await getOrganizationById(container, id);
  const before = c.req.query("before");
  const after = c.req.query("after");
  const pageSize = c.req.query("pageSize");
  const metaSchema = c.req.query("metaSchema");
  const size = Number.isInteger(Number(pageSize)) ? Number(pageSize) : 10;
  if (size > 80) {
    throw new AppError(400400, "Page size is too large");
  }

  let metaSchemaId = 0;
  if (metaSchema) {
    if (Number.isInteger(Number(metaSchema))) {
      metaSchemaId = +metaSchema;
    } else {
      const findMetaSchema = await getMetaSchemaByIdentifier(
        container,
        metaSchema
      );
      metaSchemaId = findMetaSchema.id;
    }
  }

  const {
    startCursor,
    endCursor,
    hasNextPage,
    hasPrevPage,
    rows: data,
  } = await findPosts(container, {
    organizationId: organization.id,
    metaSchemaId,
    before,
    after,
    size,
  });

  return c.json({
    data,
    pagination: { startCursor, endCursor, hasNextPage, hasPrevPage },
  });
});

organizationRouter.get("/:organization_id", async (c) => {
  const id = c.req.param("organization_id");
  const container = c.get("container");
  const organization = await getOrganizationById(container, id);
  return c.json({ data: organization });
});

organizationRouter.get("/:organization_id_or_slug/tags", async (c) => {
  const idOrSlug = c.req.param("organization_id_or_slug");
  const container = c.get("container");
  const tags = await findOrganizationRelatedTags(container, idOrSlug);
  return c.json({ data: tags });
});
