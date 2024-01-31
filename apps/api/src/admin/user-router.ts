import { Hono } from "hono";
import { type AppEnv } from "../global";
import { getUsers } from "@publiz/core";

export const adminUserRouter = new Hono<AppEnv>();

adminUserRouter.get("/", async (c) => {
  const container = c.get("container");
  const users = await getUsers(container);
  return c.json({ data: users }); // reserved for pagination
});
