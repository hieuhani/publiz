import { Hono } from "hono";
import z from "zod";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";
import { zValidator } from "@hono/zod-validator";
import {
  createCollection,
  deleteCollectionById,
  getCollectionById,
  updateCollection,
  addPostToCollection,
} from "@publiz/core";

export const adminCollectionRouter = new Hono<AppEnv>();

const createCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

adminCollectionRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", createCollectionSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const newCollection = await createCollection(container, {
      ...payload,
      type: "SYSTEM",
      userId: currentUser.id,
    });
    return c.json({ data: newCollection }, 201);
  }
);

adminCollectionRouter.delete("/:id", async (c) => {
  const container = c.get("container");
  const id = c.req.param("id");
  await deleteCollectionById(container, +id);
  return c.body(null, 204);
});

adminCollectionRouter.put(
  "/:id",
  zValidator("json", createCollectionSchema),
  async (c) => {
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const updatedCollection = await updateCollection(container, +id, payload);
    return c.json({ data: updatedCollection });
  }
);

const createCollectionPostSchema = z.object({
  postId: z.number(),
});

adminCollectionRouter.post(
  "/:id/collection_posts",
  zValidator("json", createCollectionPostSchema),
  async (c) => {
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const collection = await getCollectionById(container, +id);
    // TODO: Validate:
    // - System collection: only admin
    // - Organization collection: only organization admin
    // - User collection: only user

    const collectionPost = await addPostToCollection(container, {
      collectionId: collection.id,
      postId: payload.postId,
    });
    return c.json({ data: collectionPost });
  }
);
