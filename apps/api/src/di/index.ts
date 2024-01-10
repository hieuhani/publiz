import { MiddlewareHandler } from "hono";
import { getDatabaseModule } from "../database";
import { type Container } from "@publiz/core";

export const useDi = (): MiddlewareHandler => {
  return async (c, next) => {
    c.set("container", {
      sqlDb: getDatabaseModule({
        host: "localhost",
        user: "fibotree",
        database: "publiz",
        password: "fibotree_password",
      }),
    });
    await next();
  };
};

export type DiVariables = {
  container: Container;
};
