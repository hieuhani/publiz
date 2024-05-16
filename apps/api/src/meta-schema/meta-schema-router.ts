import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  AppError,
  findPosts,
  findSystemMetaSchemas,
  getMetaSchemaById,
  getMetaSchemaByIdentifier,
} from "@publiz/core";
import { parseContext } from "../lib/object";

export const metaSchemaRouter = new Hono<AppEnv>();

metaSchemaRouter.get("/", async (c) => {
  const container = c.get("container");
  const metaSchemas = await findSystemMetaSchemas(container);
  return c.json({ data: metaSchemas });
});

metaSchemaRouter.get("/:identity", async (c) => {
  const container = c.get("container");
  const identity = c.req.param("identity");
  if (Number.isInteger(Number(identity))) {
    const metaSchema = await getMetaSchemaById(container, +identity);
    return c.json({ data: metaSchema });
  }

  const metaSchema = await getMetaSchemaByIdentifier(container, identity);

  return c.json({ data: metaSchema });
});

metaSchemaRouter.get("/:identity/posts", async (c) => {
  const container = c.get("container");
  const identity = c.req.param("identity");
  const before = c.req.query("before");
  const after = c.req.query("after");
  const pageSize = c.req.query("pageSize");
  const context = parseContext(c.req.query("context"));
  let metaSchemaId = 0;
  if (Number.isInteger(Number(identity))) {
    metaSchemaId = +identity;
  } else {
    const metaSchema = await getMetaSchemaByIdentifier(container, identity);
    metaSchemaId = metaSchema.id;
  }

  const size = Number.isInteger(Number(pageSize)) ? Number(pageSize) : 10;
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
      metaSchemaId,
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
