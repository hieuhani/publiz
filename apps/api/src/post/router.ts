import { Hono } from "hono";
import { type AppEnv } from "../global";

import { getPostById } from "@publiz/core";
import { parseContext } from "../lib/object";

export const postRouter = new Hono<AppEnv>();

postRouter.get("/:id", async (c) => {
  const container = c.get("container");
  const id = c.req.param("id");
  const context = parseContext(c.req.query("context"));
  const post = await getPostById(container, id, context);
  return c.json({ data: post });
});
