import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  AppError,
  findSystemTaxonomies,
  getTaxonomyById,
  findTagsByTaxonomyId,
  findPosts,
  getTagById,
} from "@publiz/core";
import { parseContext } from "../lib/object";

export const taxonomyRouter = new Hono<AppEnv>();

taxonomyRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await findSystemTaxonomies(container);
  return c.json({ data: tags });
});

taxonomyRouter.get("/:identity/tags", async (c) => {
  const container = c.get("container");
  const identity = c.req.param("identity");
  const taxonomy = await getTaxonomyById(container, identity);
  const tags = await findTagsByTaxonomyId(container, taxonomy.id);
  return c.json({ data: tags });
});

taxonomyRouter.get("/:identity/posts", async (c) => {
  const container = c.get("container");
  const identity = c.req.param("identity");
  const before = c.req.query("before");
  const after = c.req.query("after");
  const tag = c.req.query("tag");
  const pageSize = c.req.query("pageSize");
  const size = Number.isInteger(Number(pageSize)) ? Number(pageSize) : 10;
  const context = parseContext(c.req.query("context"));
  if (size > 80) {
    throw new AppError(400400, "Page size is too large");
  }
  const taxonomy = await getTaxonomyById(container, identity);
  let tagId: number | undefined = undefined;
  if (tag) {
    const tagEntity = await getTagById(container, tag);
    tagId = tagEntity.id;
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
      taxonomyId: taxonomy.id,
      tagId,
      before,
      after,
      size,
    },
    context
  );

  return c.json({
    data: data,
    pagination: { startCursor, endCursor, hasNextPage, hasPrevPage },
  });
});
