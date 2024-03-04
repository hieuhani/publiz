import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string(),
  metadata: z.object({}).passthrough().optional(),
  metaSchemaId: z.number().optional(),
});

export const uploadImageFileSchema = z.object({
  file: z.instanceof(File),
  metadata: z.string().optional(),
  type: z.enum(["avatar", "cover"]),
});
