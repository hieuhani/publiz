import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  getOrganizations,
  getOrganizationById,
  findOrganizationRelatedTags,
  AppError,
  findPosts,
  getOrganizationMetaSchemaByIdentifier,
  findTaxonomiesByOrganizationId,
} from "@publiz/core";
import { parseContext } from "../lib/object";
import { getOrganizationIdFromCache } from "./lib";

export const organizationRouter = new Hono<AppEnv>();

organizationRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await getOrganizations(container);
  return c.json({ data: tags }); // reserved for pagination
});

organizationRouter.get("/:organization_id/taxonomies", async (c) => {
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
});

organizationRouter.get("/:organization_id/posts", async (c) => {
  const container = c.get("container");

  const organizationId = await getOrganizationIdFromCache(
    container,
    c.req.param("organization_id")
  );
  const organization = await getOrganizationById(container, organizationId);
  const before = c.req.query("before");
  const after = c.req.query("after");
  const pageSize = c.req.query("pageSize");
  const metaSchema = c.req.query("metaSchema");
  const size = Number.isInteger(Number(pageSize)) ? Number(pageSize) : 10;
  const context = parseContext(c.req.query("context"));
  if (size > 80) {
    throw new AppError(400400, "Page size is too large");
  }

  const {
    startCursor,
    endCursor,
    hasNextPage,
    hasPrevPage,
    rows: data,
  } = await findPosts(
    container,
    {
      organizationId: organization.id,
      metaSchema,
      before,
      after,
      size,
    },
    {
      ...context,
      moderationRequired: false,
    }
  );

  return c.json({
    data,
    pagination: { startCursor, endCursor, hasNextPage, hasPrevPage },
  });
});

organizationRouter.get("/:organization_id", async (c) => {
  const container = c.get("container");

  const organizationId = await getOrganizationIdFromCache(
    container,
    c.req.param("organization_id")
  );
  const organization = await getOrganizationById(container, organizationId);
  return c.json({ data: organization });
});

organizationRouter.get("/:organization_id_or_slug/tags", async (c) => {
  const idOrSlug = c.req.param("organization_id_or_slug");
  const container = c.get("container");
  const tags = await findOrganizationRelatedTags(container, idOrSlug);
  return c.json({ data: tags });
});

organizationRouter.get(
  "/:organization_id/meta_schemas/:identifier",
  async (c) => {
    const container = c.get("container");

    const organizationId = await getOrganizationIdFromCache(
      container,
      c.req.param("organization_id")
    );
    const identifier = c.req.param("identifier");

    const metaSchema = await getOrganizationMetaSchemaByIdentifier(
      container,
      organizationId,
      identifier
    );
    return c.json({ data: metaSchema });
  }
);
