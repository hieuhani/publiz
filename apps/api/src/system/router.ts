import { Hono } from "hono";
import { AppEnv } from "../global";
import { executeInitialMigration, getDatabaseMigrations } from "@publiz/core";

export const systemRouter = new Hono<AppEnv>();

systemRouter.get("/database_migrations", async (c) => {
  const migrations = await getDatabaseMigrations(c.get("container"));
  return c.json({ data: migrations });
});

systemRouter.get("/database_migrations/initial_database", async (c) => {
  await executeInitialMigration(c.get("container"));
  return c.json({ data: {} });
});
