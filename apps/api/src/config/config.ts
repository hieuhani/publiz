import { z } from "zod";
import { getEnvVar } from "./accessEnv";

export const zConfig = z.object({
  db: z.object({
    host: z.string(),
    port: z.number(),
    username: z.string(),
    password: z.string(),
    database: z.string(),
  }),
  firebase: z.object({
    apiKey: z.string(),
    projectId: z.string(),
  }),
});

export type Config = z.infer<typeof zConfig>;

export const config: Config = {
  db: {
    host: getEnvVar("DB_HOST"),
    port: parseInt(getEnvVar("DB_PORT") ?? "5432", 10),
    username: getEnvVar("DB_USERNAME"),
    password: getEnvVar("DB_PASSWORD"),
    database: getEnvVar("DB_DATABASE"),
  },
  firebase: {
    apiKey: getEnvVar("FIREBASE_API_KEY"),
    projectId: getEnvVar("FIREBASE_PROJECT_ID"),
  },
};
