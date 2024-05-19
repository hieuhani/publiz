import { Hono } from "hono";
import z from "zod";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user";
import { zValidator } from "@hono/zod-validator";
import { createReactionPackUseCase } from "@publiz/core";

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
