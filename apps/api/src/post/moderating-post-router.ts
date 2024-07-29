import { Hono } from "hono";
import { type AppEnv } from "../global";

import {
  Container,
  getReactionPackBySlugAndOrganizationId,
  getReactionPackUsersByUserIdAndReactionPackId,
  createReactionPostCrudUseCase,
  AppError,
  findPosts,
} from "@publiz/core";
import { useCurrentAppUser } from "../user";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getPostIdFromCache } from "./lib";

export const moderatingPostRouter = new Hono<AppEnv>();

const checkUserHasContentModerationPack = async (
  container: Container,
  userId: number
) => {
  const contentModerationPack = await getReactionPackBySlugAndOrganizationId(
    container,
    "content-moderation",
    null
  );

  await getReactionPackUsersByUserIdAndReactionPackId(
    container,
    userId,
    contentModerationPack.id
  );
};

moderatingPostRouter.get(
  "/",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const currentAppUser = c.get("currentAppUser");
    await checkUserHasContentModerationPack(container, currentAppUser.id);
    const before = c.req.query("before");
    const after = c.req.query("after");
    const pageSize = c.req.query("pageSize");
    const size = Number.isInteger(Number(pageSize)) ? Number(pageSize) : 10;
    if (size > 80) {
      throw new AppError(400400, "Page size is too large");
    }
    const {
      startCursor,
      endCursor,
      hasNextPage,
      hasPrevPage,
      rows: data,
    } = await findPosts(
      container,
      {
        before,
        after,
        size,
        reactionId: null,
      },
      {
        moderationRequired: false,
      }
    );

    return c.json({
      data,
      pagination: { startCursor, endCursor, hasNextPage, hasPrevPage },
    });
  }
);

export const createPostReaction = z.object({
  reactionId: z.number(),
});

moderatingPostRouter.post(
  "/:post_id/reactions",
  zValidator("json", createPostReaction),
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const currentAppUser = c.get("currentAppUser");
    const payload = c.req.valid("json");
    await checkUserHasContentModerationPack(container, currentAppUser.id);
    const postId = await getPostIdFromCache(container, c.req.param("post_id"));
    const reactionPost = await createReactionPostCrudUseCase(container).create({
      postId,
      userId: currentAppUser.id,
      reactionId: payload.reactionId,
    });
    return c.json({ data: reactionPost });
  }
);
