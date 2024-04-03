import { MiddlewareHandler } from "hono";
import { S3Client, type Container, createSqlDb } from "@publiz/core";
import { env } from "hono/adapter";
import { AppEnv } from "../global";
import { type Config } from "../config";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

export const useDi = (): MiddlewareHandler => {
  return async (c, next) => {
    const {
      DB_HOST,
      DB_PORT,
      DB_USER,
      DB_PASSWORD,
      DB_DATABASE,
      DB_SSL,
      DB_PREPARE,
      FIREBASE_API_KEY,
      FIREBASE_PROJECT_ID,
      ADMIN_AUTH_IDS = "",
      S3_BUCKET,
      S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY,
      S3_REGION,
      S3_ENDPOINT,
      S3_GET_GCS_IMAGE_SERVING_ENDPOINT,
      CORS_ORIGIN = "*",
      CORS_ALLOW_HEADERS = "Content-Type, Authorization",
      CORS_ALLOW_METHODS = "GET,POST,PUT,DELETE",
      CORS_MAX_AGE = "600",
      CORS_CREDENTIALS = "true",
    } = env<AppEnv["Bindings"]>(c);
    const config = {
      db: {
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        ssl: DB_SSL,
        prepare: DB_PREPARE === "true",
      },
      firebase: {
        apiKey: FIREBASE_API_KEY,
        projectId: FIREBASE_PROJECT_ID,
      },
      admin: {
        authIds: ADMIN_AUTH_IDS.split(","),
      },
      s3: {
        bucket: S3_BUCKET,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        endpoint: S3_ENDPOINT,
        region: S3_REGION,
        getGcsImageServingEndpoint: S3_GET_GCS_IMAGE_SERVING_ENDPOINT,
      },
      cors: {
        origin: CORS_ORIGIN.split(","),
        allowHeaders: CORS_ALLOW_HEADERS.split(","),
        allowMethods: CORS_ALLOW_METHODS.split(","),
        maxAge: parseInt(CORS_MAX_AGE, 10),
        credentials: CORS_CREDENTIALS === "true",
      },
    };
    const dialect = new PostgresJSDialect({
      postgres: postgres(config.db),
    });
    c.set("config", config);
    c.set("container", {
      sqlDb: createSqlDb(dialect),
      s3: new S3Client({
        endpoint: config.s3.endpoint,
        region: config.s3.region,
        credentials: {
          accessKeyId: config.s3.accessKeyId,
          secretAccessKey: config.s3.secretAccessKey,
        },
        forcePathStyle: true,
      }),
    });
    await next();
  };
};

export type DiVariables = {
  container: Container;
  config: Config;
};
