import { MiddlewareHandler } from "hono";
import { getSqlDb } from "../sqldb";
import { type Container } from "@publiz/core";
import { getS3Client } from "../s3";

export const useDi = (): MiddlewareHandler => {
  return async (c, next) => {
    c.set("container", {
      sqlDb: getSqlDb(),
      s3: getS3Client(),
    });
    await next();
  };
};

export type DiVariables = {
  container: Container;
};
