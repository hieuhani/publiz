import z from "zod";
import { Hono } from "hono";
import { type AppEnv } from "../global";
import { zValidator } from "@hono/zod-validator";
import { slugify } from "../lib/slugify";
import { uploadFile, createFile } from "@publiz/core";
import { config } from "../config";
import { useCurrentAppUser } from "../user";
import { getGcsImageServingUrl } from "@publiz/core";

export const myFileRouter = new Hono<AppEnv>();

const uploadFileSchema = z.object({
  modelName: z.string().max(100).optional(),
  modelId: z.string().optional(),
  file: z.instanceof(File),
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  metadata: z.string().optional(),
});

myFileRouter.post(
  "/",
  zValidator("form", uploadFileSchema),
  useCurrentAppUser({ required: true }),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const {
      modelName = "Uncategorized",
      modelId,
      title,
      description,
      file,
      metadata: formMetadata,
    } = c.req.valid("form");
    const container = c.get("container");
    const fileName = slugify(file.name);
    const key = [modelName, modelId, `${Date.now()}-${fileName}`]
      .filter(Boolean)
      .join("/");

    const metadata = Object.assign(
      {},
      formMetadata ? JSON.parse(formMetadata) : {},
      { userId: currentUser.id, modelName, modelId }
    );
    if (!metadata.size) {
      metadata.size = file.size;
    }

    const fileBuffer = await file.arrayBuffer();

    await uploadFile(container, {
      bucket: config.s3.bucket,
      key,
      body: fileBuffer as any,
      metadata: Object.keys(metadata).reduce((prev, current) => {
        if (!metadata[current]) {
          return prev;
        }
        return {
          ...prev,
          [current]: `${metadata[current]}`,
        };
      }, {}),
    });

    if (file.type.startsWith("image/")) {
      const imageServingEndpoint = config.s3.getGcsImageServingEndpoint;
      if (imageServingEndpoint) {
        metadata.gcsImageServingUrl = await getGcsImageServingUrl({
          bucket: config.s3.bucket,
          key,
          endpoint: imageServingEndpoint,
        });
      }
    }

    const createdFile = await createFile(container, {
      contentType: file.type,
      fileName,
      title,
      description,
      filePath: key,
      metadata,
      userId: currentUser.id,
    });

    return c.json({ data: createdFile });
  }
);
