import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string(),
  metadata: z.object({}).passthrough().optional(),
  metaSchemaId: z.number().optional(),
});
