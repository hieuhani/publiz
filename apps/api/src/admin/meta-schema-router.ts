import { Hono } from "hono";
import z from "zod";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";
import { zValidator } from "@hono/zod-validator";
import {
  createMetaSchema,
  deleteMetaSchemaById,
  updateMetaSchema,
} from "@publiz/core";

export const adminMetaSchemaRouter = new Hono<AppEnv>();

const createMetaSchemaSchema = z.object({
  name: z.string().min(1).max(100),
  schema: z.string().min(2),
  target: z.enum(["post", "user"]),
  organizationId: z.number().optional(),
});

adminMetaSchemaRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", createMetaSchemaSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const container = c.get("container");
    const metaSchema = await createMetaSchema(container, payload);
    return c.json(metaSchema, 201);
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
    return c.json(metaSchema);
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
