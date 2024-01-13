import { MiddlewareHandler } from "hono";
import { getDatabaseModule } from "../database";
import { type Container } from "@publiz/core";
import { config } from "../config";

export const useDi = (): MiddlewareHandler => {
  return async (c, next) => {
    c.set("container", {
      sqlDb: getDatabaseModule({
        host: config.db.host,
        user: config.db.username,
        database: config.db.database,
        password: config.db.password,
      }),
    });
    await next();
  };
};

export type DiVariables = {
  container: Container;
};
