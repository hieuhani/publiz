import { Hono } from "hono";
import { type AppEnv } from "../global";
import { zValidator } from "@hono/zod-validator";
import { useCurrentAppUser } from "../user";
import {
  createPost,
  updatePost,
  getMyPostById,
  findPostsByUserId,
} from "@publiz/core";
import { createPostSchema, updatePostSchema } from "./schema";
import { getPostIdFromCache } from "./lib";

export const myPostRouter = new Hono<AppEnv>();

myPostRouter.post(
  "/",
  zValidator("json", createPostSchema),
  useCurrentAppUser({ required: true }),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const post = await createPost(container, {
      ...payload,
      authorId: currentUser.id,
      type: "POST",
    });
    return c.json({ data: post });
  }
);

myPostRouter.put(
  "/:post_id",
  useCurrentAppUser({ required: true }),
  zValidator("json", updatePostSchema),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const payload = c.req.valid("json");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    // verify that the post belongs to the current user
    await getMyPostById(container, currentUser.id, postId);
    const updatedPost = await updatePost(container, postId, payload);
    return c.json({ data: updatedPost });
  }
);

myPostRouter.get(
  "/:post_id",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    const currentUser = c.get("currentAppUser");
    const post = await getMyPostById(container, currentUser.id, postId);
    return c.json({ data: post });
  }
);

myPostRouter.get("/", useCurrentAppUser({ required: true }), async (c) => {
  const container = c.get("container");
  const currentUser = c.get("currentAppUser");
  const posts = await findPostsByUserId(container, currentUser.id);
  return c.json({ data: posts });
});
