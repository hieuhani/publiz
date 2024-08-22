import { Hono } from "hono";
import { type AppEnv } from "../global";
import { z } from "zod";
import { bulkCreatePosts, findPosts } from "@publiz/core";
import { zValidator } from "@hono/zod-validator";

export const adminPostRouter = new Hono<AppEnv>();

export const createPostSchema = z.array(
  z.object({
    title: z.string().max(255),
    content: z.string(),
    contentJson: z.object({}).passthrough().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    parentId: z.number().optional(),
    authorId: z.number(),
    organizationId: z.number().optional(),
    type: z.enum(["REVISION", "POST"]),
    metadata: z.object({}).passthrough().optional(),
  })
);

adminPostRouter.post("/", zValidator("json", createPostSchema), async (c) => {
  const container = c.get("container");
  const payload = c.req.valid("json");
  const results = await bulkCreatePosts(container, payload);

  return c.json({
    numInsertedOrUpdatedRows: results[0].numInsertedOrUpdatedRows?.toString(),
  });
});

adminPostRouter.get("/", async (c) => {
  const container = c.get("container");
  const metaSchema = c.req.query("metaSchema");
  const pageSize = c.req.query("pageSize");
  const {
    startCursor,
    endCursor,
    hasNextPage,
    hasPrevPage,
    rows: data,
  } = await findPosts(container, {
    metaSchema,
    size: pageSize ? +pageSize : 10,
  });

  return c.json({
    data: data,
    pagination: { startCursor, endCursor, hasNextPage, hasPrevPage },
  });
});
