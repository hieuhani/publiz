import { Hono } from "hono";
import { type AppEnv } from "../global";
import { getOrganizations, findPostsByOrganizationId } from "@publiz/core";

export const organizationRouter = new Hono<AppEnv>();

organizationRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await getOrganizations(container);
  return c.json({ data: tags }); // reserved for pagination
});

organizationRouter.get("/:organization_id/posts", async (c) => {
  const id = c.req.param("organization_id");
  const container = c.get("container");
  const posts = await findPostsByOrganizationId(container, +id);
  return c.json({ data: posts });
});
