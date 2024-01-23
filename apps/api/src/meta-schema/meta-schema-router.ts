import { Hono } from "hono";
import { type AppEnv } from "../global";
import { findSystemMetaSchemas } from "@publiz/core";

export const metaSchemaRouter = new Hono<AppEnv>();

metaSchemaRouter.get("/", async (c) => {
  const container = c.get("container");
  const metaSchemas = await findSystemMetaSchemas(container);
  return c.json({ data: metaSchemas });
});
