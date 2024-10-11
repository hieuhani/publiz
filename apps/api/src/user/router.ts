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
  findPosts,
  getFileUrl,
  getGcsImageServingUrl,
  getUserById,
  patchUserMetadataById,
  updateUser,
  uploadFile,
  getMyReactionPacks,
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
    if (newUser.updatedAt) {
      c.header("Last-Modified", newUser.updatedAt);
    }
    return c.json({ data: newUser });
  }
  if (currentAppUser.updatedAt) {
    c.header("Last-Modified", currentAppUser.updatedAt);
  }
  c.header("Vary", "Authorization");
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
});

userRouter.get("/:identity/posts", async (c) => {
  const container = c.get("container");
  const identity = c.req.param("identity");
  const before = c.req.query("before");
  const after = c.req.query("after");
  const pageSize = c.req.query("pageSize");
  const size = Number.isInteger(Number(pageSize)) ? Number(pageSize) : 10;
  if (size > 80) {
    throw new AppError(400400, "Page size is too large");
  }
  if (!Number.isInteger(Number(identity))) {
    throw new AppError(500, "Querying user by username is not supported");
  }
  const user = await getUserById(container, +identity);

  const {
    startCursor,
    endCursor,
    hasNextPage,
    hasPrevPage,
    rows: data,
  } = await findPosts(container, {
    userId: user.id,
    organizationId: 0,
    before,
    after,
    size,
  });

  return c.json({
    data: data,
    pagination: { startCursor, endCursor, hasNextPage, hasPrevPage },
  });
});

userRouter.get(
  "/my_reaction_packs",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const container = c.get("container");
    const currentAppUser = c.get("currentAppUser");

    const data = await getMyReactionPacks(container, currentAppUser.id);

    return c.json({
      data: data,
    });
  }
);
