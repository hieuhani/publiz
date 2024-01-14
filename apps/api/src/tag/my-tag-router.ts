import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user/middleware";
import {
  createTag,
  deleteTagById,
  getMyTagById,
  updateTag,
} from "@publiz/core";

export const myTagRouter = new Hono<AppEnv>();

const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

myTagRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", createTagSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const tag = await createTag(container, {
      ...payload,
      type: "DEFAULT",
      userId: currentUser.id,
    });
    return c.json(tag, 201);
  }
);

myTagRouter.delete("/:id", useCurrentAppUser({ required: true }), async (c) => {
  const currentUser = c.get("currentAppUser");
  const container = c.get("container");
  const id = c.req.param("id");
  const myTag = await getMyTagById(container, currentUser.id, +id);
  await deleteTagById(container, myTag.id);
  return c.body(null, 204);
});

const updateTagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

myTagRouter.put(
  "/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", updateTagSchema),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const myTag = await getMyTagById(container, currentUser.id, +id);
    const updatedTag = await updateTag(container, myTag.id, payload);
    return c.json(updatedTag);
  }
);
