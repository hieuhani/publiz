import { Hono } from "hono";
import z from "zod";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";
import { zValidator } from "@hono/zod-validator";
import { bulkCreateTags, deleteTagById, updateTag } from "@publiz/core";

export const adminTagRouter = new Hono<AppEnv>();

const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  parentId: z.number().optional(),
  taxonomyId: z.number().optional(),
});
const bulkCreateTagSchema = z.array(createTagSchema);

adminTagRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", bulkCreateTagSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const results = await bulkCreateTags(
      container,
      payload.map((p) => ({
        ...p,
        type: "SYSTEM",
        userId: currentUser.id,
      }))
    );
    return c.json({
      numInsertedOrUpdatedRows: results[0].numInsertedOrUpdatedRows?.toString(),
    });
  }
);

adminTagRouter.delete(
  "/:id",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const id = c.req.param("id");
    await deleteTagById(container, +id);
    return c.body(null, 204);
  }
);

adminTagRouter.put(
  "/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", createTagSchema),
  async (c) => {
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const updatedTag = await updateTag(container, +id, payload);
    return c.json({ data: updatedTag });
  }
);
