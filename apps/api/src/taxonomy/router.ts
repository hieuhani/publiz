import { Hono } from "hono";
import { type AppEnv } from "../global";
import { findSystemTaxonomies, getTaxonomyById } from "@publiz/core";
import { findTagsByTaxonomyId } from "@publiz/sqldb";

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
  const tags = await findTagsByTaxonomyId(container.sqlDb, taxonomy.id);
  return c.json({ data: tags });
});
