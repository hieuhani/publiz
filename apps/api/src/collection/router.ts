import { Hono } from "hono";
import { type AppEnv } from "../global";
import { AppError, findPosts, getCollectionById } from "@publiz/core";
import { parseContext } from "../lib/object";

export const collectionRouter = new Hono<AppEnv>();

collectionRouter.get("/:id/posts", async (c) => {
  const container = c.get("container");
  const id = c.req.param("id");
  const collection = await getCollectionById(container, id);
  const before = c.req.query("before");
  const after = c.req.query("after");
  const pageSize = c.req.query("pageSize");
  const context = parseContext(c.req.query("context"));
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
      collectionId: collection.id,
      before,
      after,
      size,
    },
    context
  );

  return c.json({
    data,
    pagination: { startCursor, endCursor, hasNextPage, hasPrevPage },
  });
});
