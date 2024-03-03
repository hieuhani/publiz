import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().max(255),
  content: z.string(),
  contentJson: z.object({}).passthrough().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metadata: z.object({}).passthrough().optional(),
  metaSchemaId: z.number().optional(),
  tagIds: z.array(z.number()).optional(),
});

export const updatePostSchema = createPostSchema;
