import { Hono } from "hono";
import { type AppEnv } from "../global";
import { getOrganizations } from "@publiz/core";

export const organizationRouter = new Hono<AppEnv>();

organizationRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await getOrganizations(container);
  return c.json({ data: tags }); // reserved for pagination
});
