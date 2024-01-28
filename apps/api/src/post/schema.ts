import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().max(255),
  content: z.string(),
  excerpt: z.string().max(255),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metadata: z.object({}).passthrough().optional(),
  metaSchemaId: z.number().optional(),
});

export const updatePostSchema = createPostSchema;
