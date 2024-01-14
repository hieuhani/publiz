import { MiddlewareHandler } from "hono";
import { getSqlDb } from "../sqldb";
import { type Container } from "@publiz/core";

export const useDi = (): MiddlewareHandler => {
  return async (c, next) => {
    c.set("container", {
      sqlDb: getSqlDb(),
    });
    await next();
  };
};

export type DiVariables = {
  container: Container;
};
