import { Hono } from "hono";
import z from "zod";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";
import { zValidator } from "@hono/zod-validator";
import {
  createMetaSchema,
  deleteMetaSchemaById,
  setDefaultMetaSchemaForOrganizationByTarget,
  updateMetaSchema,
} from "@publiz/core";

export const adminMetaSchemaRouter = new Hono<AppEnv>();

const createMetaSchemaSchema = z.object({
  name: z.string().min(1).max(100),
  schema: z.object({}).passthrough(),
  target: z.enum(["post", "user"]),
  organizationId: z.number().optional(),
  version: z.number(),
});

adminMetaSchemaRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", createMetaSchemaSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const container = c.get("container");
    const metaSchema = await createMetaSchema(container, payload);
    return c.json({ data: metaSchema }, 201);
  }
);

adminMetaSchemaRouter.put(
  "/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", createMetaSchemaSchema),
  async (c) => {
    const container = c.get("container");
    const id = c.req.param("id");
    const payload = c.req.valid("json");
    const metaSchema = await updateMetaSchema(container, +id, payload);
    return c.json({ data: metaSchema });
  }
);

const updateDefaultMetaSchemaSchema = z.object({
  organizationId: z.number().optional(),
});

adminMetaSchemaRouter.patch(
  "/:id/update_default_meta_schema",
  useCurrentAppUser({ required: true }),
  zValidator("json", updateDefaultMetaSchemaSchema),
  async (c) => {
    const container = c.get("container");
    const id = c.req.param("id");
    const { organizationId } = c.req.valid("json");
    const metaSchema = await setDefaultMetaSchemaForOrganizationByTarget(
      container,
      {
        organizationId: organizationId ?? null,
        metaSchemaId: +id,
      }
    );
    return c.json({ data: metaSchema });
  }
);

adminMetaSchemaRouter.delete(
  "/:id",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const id = c.req.param("id");
    await deleteMetaSchemaById(container, +id);
    return c.body(null, 204);
  }
);
