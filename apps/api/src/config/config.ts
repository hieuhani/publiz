import { z } from "zod";

export const zConfig = z.object({
  db: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
    ssl: z
      .object({
        rejectUnauthorized: z.boolean(),
      })
      .optional(),
    prepare: z.boolean().optional(),
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
    getGcsImageServingEndpoint: z.string().optional(),
  }),
  cors: z.object({
    origin: z.array(z.string()),
    allowHeaders: z.array(z.string()),
    allowMethods: z.array(z.string()),
    maxAge: z.number(),
    credentials: z.boolean(),
  }),
});

export type Config = z.infer<typeof zConfig>;
