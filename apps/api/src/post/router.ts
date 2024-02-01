import { Hono } from "hono";
import { type AppEnv } from "../global";

import { getPostById } from "@publiz/core";

export const postRouter = new Hono<AppEnv>();

postRouter.get("/:id", async (c) => {
  const container = c.get("container");
  const id = c.req.param("id");
  const post = await getPostById(container, +id);
  return c.json({ data: post });
});
