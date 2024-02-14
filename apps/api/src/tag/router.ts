import { Hono } from "hono";
import { type AppEnv } from "../global";
import { findSystemTags } from "@publiz/core";

export const tagRouter = new Hono<AppEnv>();

tagRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await findSystemTags(container);
  return c.json({ data: tags }); // reserved for pagination
});
