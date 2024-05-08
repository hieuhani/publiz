import { Hono } from "hono";
import z from "zod";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";
import { zValidator } from "@hono/zod-validator";
import {
  createTaxonomy,
  deleteTaxonomyById,
  updateTaxonomy,
} from "@publiz/core";

export const adminTaxonomyRouter = new Hono<AppEnv>();

const createTaxonomySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

adminTaxonomyRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", createTaxonomySchema),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const newTaxonomy = await createTaxonomy(container, {
      ...payload,
      type: "SYSTEM",
      userId: currentUser.id,
    });
    return c.json({ data: newTaxonomy }, 201);
  }
);

adminTaxonomyRouter.delete(
  "/:id",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const id = c.req.param("id");
    await deleteTaxonomyById(container, +id);
    return c.body(null, 204);
  }
);

adminTaxonomyRouter.put(
  "/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", createTaxonomySchema),
  async (c) => {
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const updatedTaxonomy = await updateTaxonomy(container, +id, payload);
    return c.json({ data: updatedTaxonomy });
  }
);
