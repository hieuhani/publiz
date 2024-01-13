import { Hono } from "hono";
import { type AppEnv } from "../global";
import { getTags } from "@publiz/core";

export const tagRouter = new Hono<AppEnv>();

tagRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await getTags(container);
  return c.json({ data: tags }); // reserved for pagination
});
