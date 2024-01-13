import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user/middleware";
import { deleteTagById, getMyTagById, updateTag } from "@publiz/core";

export const myTagRouter = new Hono<AppEnv>();

myTagRouter.delete("/:id", useCurrentAppUser({ required: true }), async (c) => {
  const currentUser = c.get("currentAppUser");
  const container = c.get("container");
  const id = c.req.param("id");
  const myTag = await getMyTagById(container, currentUser.id, +id);
  await deleteTagById(container, myTag.id);
  return c.body(null, 204);
});

const updateTagSchema = z.object({
  name: z.string(),
  slug: z.string(),
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
