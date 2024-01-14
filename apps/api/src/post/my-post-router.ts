import { Hono } from "hono";
import { type AppEnv } from "../global";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { useCurrentAppUser } from "../user";
import { createPost, updatePost, getMyPostById } from "@publiz/core";

export const myPostRouter = new Hono<AppEnv>();

export const createPostSchema = z.object({
  title: z.string().max(255),
  content: z.string(),
  excerpt: z.string().max(255),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

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
    return c.json(post);
  }
);

myPostRouter.put(
  "/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", createPostSchema),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const myPost = await getMyPostById(container, currentUser.id, +id);
    const updatedPost = await updatePost(container, myPost.id, payload);
    return c.json(updatedPost);
  }
);
