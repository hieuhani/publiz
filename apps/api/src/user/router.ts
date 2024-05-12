import { Hono } from "hono";
import { googleAccountLookUp } from "@fiboup/google-identify-toolkit";
import { type AppEnv } from "../global";
import { useCurrentAppUser } from "./middleware";
import { authorizationHeader, tokenPrefix } from "./constant";
import { get } from "../lib/get";
import {
  AppError,
  Container,
  createFile,
  createUser,
  getFileUrl,
  getGcsImageServingUrl,
  getUserById,
  patchUserMetadataById,
  updateUser,
  uploadFile,
} from "@publiz/core";
import { zValidator } from "@hono/zod-validator";
import { updateProfileSchema, uploadImageFileSchema } from "./schema";
import { slugify } from "../lib/slugify";
import { normalizeMetadata } from "../lib/object";

export const userRouter = new Hono<AppEnv>();

// this api is used to get the current user profile by the current auth token
// the auth token is issued by Auth provider (Firebase Auth)
// if the user is not registered on this system, we will create a new user
userRouter.get("/my_profile", useCurrentAppUser(), async (c) => {
  const currentAppUser = c.get("currentAppUser");
  if (!currentAppUser) {
    const tokenHeader = c.req.header(authorizationHeader) || "";
    const idToken = tokenHeader.substring(tokenPrefix.length);
    const config = c.get("config");
    const firebaseAccount = await googleAccountLookUp(config.firebase, {
      idToken,
    });
    if (firebaseAccount.users.length === 0) {
      throw new AppError(
        500001,
        "This user is not registered on the auth system"
      );
    }

    const container = c.get("container") as Container;
    const localId = get(firebaseAccount, "users[0].localId");
    const newUser = await createUser(container, {
      authId: localId,
      displayName: "",
    });
    return c.json({ data: newUser });
  }

  return c.json({ data: currentAppUser });
});

userRouter.put(
  "/my_profile",
  zValidator("json", updateProfileSchema),
  useCurrentAppUser({ required: true }),
  async (c) => {
    const currentAppUser = c.get("currentAppUser");
    const container = c.get("container") as Container;

    const userPayload = c.req.valid("json");

    const updatedUser = await updateUser(
      container,
      currentAppUser.id,
      userPayload
    );
    return c.json(updatedUser);
  }
);

userRouter.patch(
  "/my_profile/image",
  zValidator("form", uploadImageFileSchema),
  useCurrentAppUser({ required: true }),
  async (c) => {
    const config = c.get("config");
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const { file, metadata: formMetadata, type } = c.req.valid("form");
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image file");
    }

    const modelName = "user";
    const modelId = currentUser.id;
    const fileName = slugify(file.name);
    const key = [modelName, modelId, `${type}-${Date.now()}-${fileName}`]
      .filter(Boolean)
      .join("/");

    const rawMetadata = formMetadata ? JSON.parse(formMetadata) : {};
    const metadata = Object.assign({}, rawMetadata, {
      userId: currentUser.id,
      modelName,
      modelId,
    });
    if (!metadata.size) {
      metadata.size = file.size;
    }

    const fileBuffer = await file.arrayBuffer();
    await uploadFile(container, {
      bucket: config.s3.bucket,
      key,
      body: fileBuffer as any,
      metadata: normalizeMetadata(metadata),
    });
    const imageServingEndpoint = config.s3.getGcsImageServingEndpoint;
    if (imageServingEndpoint) {
      metadata.gcsImageServingUrl = await getGcsImageServingUrl({
        bucket: config.s3.bucket,
        key,
        endpoint: imageServingEndpoint,
      });
    }

    const imageFile = await createFile(container, {
      contentType: file.type,
      fileName,
      bucket: config.s3.bucket,
      filePath: key,
      metadata,
      userId: currentUser.id,
    });
    const fileUrl = await getFileUrl(container, imageFile);
    const imageMeta = {
      ...rawMetadata,
      src: fileUrl,
    };
    const updatedUser = await patchUserMetadataById(container, currentUser.id, {
      [type]: imageMeta,
    });
    return c.json({ data: updatedUser });
  }
);

userRouter.get("/:identity", async (c) => {
  const container = c.get("container") as Container;
  const identity = c.req.param("identity");
  if (Number.isInteger(Number(identity))) {
    const user = await getUserById(container, +identity);
    if (user.updatedAt) {
      c.header("Last-Modified", user.updatedAt);
    }
    return c.json({ data: user });
  }

  throw new AppError(500, "Querying user by username is not supported");
});
