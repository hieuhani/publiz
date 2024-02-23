import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  getOrganizations,
  findPostsByOrganizationId,
  getOrganizationById,
} from "@publiz/core";

export const organizationRouter = new Hono<AppEnv>();

organizationRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await getOrganizations(container);
  return c.json({ data: tags }); // reserved for pagination
});

organizationRouter.get("/:organization_id/posts", async (c) => {
  const id = c.req.param("organization_id");
  const container = c.get("container");
  const organization = await getOrganizationById(container, id);
  const posts = await findPostsByOrganizationId(
    container,
    organization.id as number
  );
  return c.json({ data: posts });
});

organizationRouter.get("/:organization_id", async (c) => {
  const id = c.req.param("organization_id");
  const container = c.get("container");
  const organization = await getOrganizationById(container, id);
  return c.json({ data: organization });
});
