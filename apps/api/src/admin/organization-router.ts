import { Hono } from "hono";
import z from "zod";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";
import { zValidator } from "@hono/zod-validator";
import {
  createOrganization,
  deleteOrganizationById,
  updateOrganization,
} from "@publiz/core";

export const adminOrganizationRouter = new Hono<AppEnv>();

const createOrganizationSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string(),
  verified: z.boolean(),
  ownerId: z.number(),
});

adminOrganizationRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", createOrganizationSchema),
  async (c) => {
    const payload = c.req.valid("json");

    const container = c.get("container");
    const tag = await createOrganization(container, payload);
    return c.json({ data: tag }, 201);
  }
);

adminOrganizationRouter.put(
  "/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", createOrganizationSchema),
  async (c) => {
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const updatedTag = await updateOrganization(container, +id, payload);
    return c.json({ data: updatedTag });
  }
);

adminOrganizationRouter.delete(
  "/:id",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const id = c.req.param("id");
    await deleteOrganizationById(container, +id);
    return c.body(null, 204);
  }
);
