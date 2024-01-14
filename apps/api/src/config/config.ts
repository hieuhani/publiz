import { z } from "zod";
import { getEnvVar } from "./env";

export const zConfig = z.object({
  db: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
  }),
  firebase: z.object({
    apiKey: z.string(),
    projectId: z.string(),
  }),
  admin: z.object({
    authIds: z.array(z.string()),
  }),
  s3: z.object({
    bucket: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    region: z.string().optional(),
    endpoint: z.string().optional(),
  }),
});

export type Config = z.infer<typeof zConfig>;

export const config: Config = {
  db: {
    host: getEnvVar("DB_HOST"),
    port: parseInt(getEnvVar("DB_PORT") ?? "5432", 10),
    user: getEnvVar("DB_USER"),
    password: getEnvVar("DB_PASSWORD"),
    database: getEnvVar("DB_DATABASE"),
  },
  firebase: {
    apiKey: getEnvVar("FIREBASE_API_KEY"),
    projectId: getEnvVar("FIREBASE_PROJECT_ID"),
  },
  admin: {
    authIds: getEnvVar("ADMIN_AUTH_IDS", "").split(","),
  },
  s3: {
    bucket: getEnvVar("S3_BUCKET"),
    accessKeyId: getEnvVar("S3_ACCESS_KEY_ID"),
    secretAccessKey: getEnvVar("S3_SECRET_ACCESS_KEY"),
    endpoint: getEnvVar("S3_ENDPOINT", "http://s3.amazonaws.com"),
    region: getEnvVar("S3_REGION", "ap-southeast-1"),
  },
};
