import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "../user/middleware";
import { createTag, getTags } from "@publiz/core";

export const tagRouter = new Hono<AppEnv>();

const createTagSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

tagRouter.post(
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

tagRouter.get("/", async (c) => {
  const container = c.get("container");
  const tags = await getTags(container);
  return c.json({ data: tags }); // reserved for pagination
});
