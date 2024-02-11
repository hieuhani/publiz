import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  findSystemMetaSchemas,
  getMetaSchemaById,
  getMetaSchemaByIdentifier,
} from "@publiz/core";

export const metaSchemaRouter = new Hono<AppEnv>();

metaSchemaRouter.get("/", async (c) => {
  const container = c.get("container");
  const metaSchemas = await findSystemMetaSchemas(container);
  return c.json({ data: metaSchemas });
});

metaSchemaRouter.get("/:identity", async (c) => {
  const container = c.get("container");
  const identity = c.req.param("identity");
  if (!isNaN(parseInt(identity, 10))) {
    const metaSchema = await getMetaSchemaById(container, +identity);
    return c.json({ data: metaSchema });
  }

  const metaSchema = await getMetaSchemaByIdentifier(container, identity);

  return c.json({ data: metaSchema });
});
