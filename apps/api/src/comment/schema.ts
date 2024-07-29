import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string(),
  metadata: z.object({}).passthrough().optional(),
  metaSchema: z.string().optional(),
  // target: z.enum(["post"]),
  // targetId: z.string(),
});

export const updateCommentSchema = createCommentSchema;
