import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  createReactionPackUseCase,
  createReactionUseCase,
  createReactionPackUserUseCase,
} from "@publiz/core";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";

export const adminReactionPackRouter = new Hono<AppEnv>();

const createReactionPackSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string(),
  type: z.enum(["SYSTEM", "DEFAULT", "PRIVILEGE"]),
});

adminReactionPackRouter.post(
  "/",
  useCurrentAppUser({ required: true }),
  zValidator("json", createReactionPackSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const newEntity = await createReactionPackUseCase(container).create({
      ...payload,
      userId: currentUser.id,
    });
    return c.json({ data: newEntity }, 201);
  }
);

adminReactionPackRouter.delete(
  "/:id",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const id = c.req.param("id");
    await createReactionPackUseCase(container).delete(+id);
    return c.body(null, 204);
  }
);

adminReactionPackRouter.put(
  "/:id",
  useCurrentAppUser({ required: true }),
  zValidator("json", createReactionPackSchema),
  async (c) => {
    const container = c.get("container");
    const payload = c.req.valid("json");
    const id = c.req.param("id");
    const updatedEntity = await createReactionPackUseCase(container).update(
      +id,
      payload
    );
    return c.json({ data: updatedEntity });
  }
);

const createReactionSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(100),
  metadata: z.object({}).passthrough(),
});

adminReactionPackRouter.post(
  "/:id/reactions",
  useCurrentAppUser({ required: true }),
  zValidator("json", createReactionSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const container = c.get("container");
    const id = c.req.param("id");
    const reactionPack =
      await createReactionPackUseCase(container).getById(+id);

    const newEntity = await createReactionUseCase(container).create({
      ...payload,
      reactionPackId: reactionPack.id,
    });
    return c.json({ data: newEntity }, 201);
  }
);

const createReactionPackUserSchema = z.object({
  userId: z.number(),
});

adminReactionPackRouter.post(
  "/:id/reaction_pack_users",
  useCurrentAppUser({ required: true }),
  zValidator("json", createReactionPackUserSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const container = c.get("container");
    const id = c.req.param("id");
    const reactionPack =
      await createReactionPackUseCase(container).getById(+id);

    const newEntity = await createReactionPackUserUseCase(container).create({
      userId: payload.userId,
      reactionPackId: reactionPack.id,
    });
    return c.json({ data: newEntity }, 201);
  }
);
