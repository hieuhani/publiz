import {
  type InsertablePostRow,
  createPostCrudRepository,
  getPostByIdAndUserId,
  UpdateablePostRow,
  getPostByIdAndOrganizationId,
  getPostById as getPostByIdRepo,
  findPosts as findPostsRepo,
  createPostTagCrudRepository,
  findPostTagsByPostId,
  getPostsByUserId as getPostsByUserIdRepo,
  getContentModerationApproveReaction,
  getPostByPublicId,
} from "@publiz/sqldb";
import { customAlphabet } from "nanoid";
import { Validator } from "@cfworker/json-schema";
import { Container } from "../container";
import { getMetaSchemaByIdentifier } from "../meta-schema";
import { AppError } from "../error";
import { findTagsByIds } from "../tag";
import { makePublicEntity } from "../lib/public-id";

type CreatePostInput = Omit<InsertablePostRow, "publicId"> & {
  metadata?: any;
  tagIds?: number[];
};

const PUBLIC_ID_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const PUBLIC_ID_LENGTH = 12;
const nanoid = customAlphabet(PUBLIC_ID_ALPHABET, PUBLIC_ID_LENGTH);
function generateUniqueIds(count: number): string[] {
  const ids: string[] = [];
  while (ids.length < count) {
    const id = nanoid();
    if (!ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids;
}

export const createPost = async (
  container: Container,
  { tagIds = [], ...input }: CreatePostInput
) => {
  if (input.metaSchema) {
    const metaSchema = await getMetaSchemaByIdentifier(
      container,
      input.metaSchema
    );
    const validator = new Validator(metaSchema.schema);
    const result = validator.validate(input.metadata);
    if (!result.valid) {
      throw new AppError(400_102, "Invalid metadata", result.errors);
    }
  }

  if (tagIds.length > 0) {
    const tags = await findTagsByIds(container, tagIds);
    const availableTags = tags.filter(
      (tag) =>
        tag.type === "SYSTEM" || tag.organizationId === input.organizationId
    );
    if (availableTags.length > 0) {
      return container.sqlDb.transaction().execute(async (trx) => {
        const post = await createPostCrudRepository(trx).create({
          ...input,
          publicId: nanoid(),
        });
        await createPostTagCrudRepository(trx).createMulti(
          availableTags.map((tag) => ({ postId: post.id, tagId: tag.id }))
        );
        return post;
      });
    }
  }

  const post = await createPostCrudRepository(container.sqlDb).create({
    ...input,
    publicId: nanoid(),
  });
  return makePublicEntity(post);
};

export const getMyPostById = async (
  container: Container,
  userId: number,
  postId: number
) => {
  const post = await getPostByIdAndUserId(container.sqlDb, postId, userId);
  return makePublicEntity(post);
};

export const findPostsByUserId = async (
  container: Container,
  userId: number
) => {
  const posts = await getPostsByUserIdRepo(container.sqlDb, userId);
  return posts.map(makePublicEntity);
};

export const getOrganizationPostById = async (
  container: Container,
  organizationId: number,
  postId: number
) => {
  const post = await getPostByIdAndOrganizationId(
    container.sqlDb,
    postId,
    organizationId
  );
  return makePublicEntity(post);
};

type UpdatePostInput = UpdateablePostRow & {
  metadata?: any;
  tagIds?: number[];
};

export const updatePost = async (
  container: Container,
  id: number,
  { tagIds, ...input }: UpdatePostInput
) => {
  if (input.metaSchema) {
    const metaSchema = await getMetaSchemaByIdentifier(
      container,
      input.metaSchema
    );
    const validator = new Validator(metaSchema.schema);

    const result = validator.validate(input.metadata);

    if (!result.valid) {
      throw new AppError(400_102, "Invalid metadata", result.errors);
    }
  }
  if (tagIds) {
    const postTags = await findPostTagsByPostId(container.sqlDb, id);

    return container.sqlDb.transaction().execute(async (trx) => {
      if (tagIds.length === 0) {
        if (postTags.length > 0) {
          await createPostTagCrudRepository(trx).bulkDelete(
            postTags.map((postTag) => postTag.id)
          );
        }
      } else {
        const currentTagIds = new Set(postTags.map((postTag) => postTag.tagId));
        const newTagIds = new Set(tagIds);

        const toInsertTagIds = tagIds.filter(
          (tagId) => !currentTagIds.has(tagId)
        );

        if (toInsertTagIds.length > 0) {
          await createPostTagCrudRepository(trx).createMulti(
            toInsertTagIds.map((tagId) => ({ postId: id, tagId }))
          );
        }

        const toDeletePostTagIds = postTags
          .filter((postTag) => !newTagIds.has(postTag.tagId))
          .map((postTag) => postTag.id);

        if (toDeletePostTagIds.length > 0) {
          await createPostTagCrudRepository(trx).bulkDelete(toDeletePostTagIds);
        }
      }
      const post = await createPostCrudRepository(trx).update(id, input);
      return makePublicEntity(post);
    });
  }
  const post = await createPostCrudRepository(container.sqlDb).update(
    id,
    input
  );
  return makePublicEntity(post);
};

export const getPostById = async (
  container: Container,
  id: number | string,
  context?: {
    withOrganization?: boolean;
  }
) => {
  const post = await getPostByIdRepo(container.sqlDb, id, context);
  return makePublicEntity(post);
};

export const bulkCreatePosts = async (
  container: Container,
  records: Omit<InsertablePostRow, "publicId">[]
) => {
  const uniquePublicIds = generateUniqueIds(records.length);
  return container.sqlDb.transaction().execute(async (trx) => {
    return createPostCrudRepository(trx).createMulti(
      records.map((record, index) => ({
        ...record,
        publicId: uniquePublicIds[index],
      }))
    );
  });
};

export const deletePost = async (container: Container, id: number) => {
  return createPostCrudRepository(container.sqlDb).delete(id);
};

type FindPostsPayload = {
  organizationId?: number;
  metaSchemaId?: number;
  metaSchema?: string;
  collectionId?: number;
  taxonomyId?: number;
  tagId?: number;
  userId?: number;
  after?: string;
  before?: string;
  size?: number;
  reactionId?: number | null;
};

export const findPosts = async (
  container: Container,
  {
    organizationId,
    collectionId,
    metaSchemaId,
    metaSchema,
    taxonomyId,
    tagId,
    userId,
    after,
    before,
    size,
    reactionId,
  }: FindPostsPayload,
  context?: {
    withOrganization?: boolean;
    moderationRequired?: boolean;
  }
) => {
  const { withOrganization = false, moderationRequired = true } = context || {};
  if (moderationRequired) {
    const approvedReaction = await getContentModerationApproveReaction(
      container.sqlDb
    );
    if (reactionId) {
      console.warn(
        "reactionId is already set, but it is overridden by moderation required flag"
      );
    }
    reactionId = approvedReaction.id;
  }
  const paginatedPosts = await findPostsRepo(
    container.sqlDb,
    {
      organizationId,
      collectionId,
      metaSchemaId,
      metaSchema,
      taxonomyId,
      tagId,
      userId,
      reactionId,
    },
    { after, before, size },
    { withOrganization }
  );

  return {
    ...paginatedPosts,
    rows: paginatedPosts.rows.map(makePublicEntity),
  };
};

export const getPostId = async (
  container: Container,
  idOrSlug: string | number
) => {
  if (Number.isInteger(Number(idOrSlug))) {
    return +idOrSlug;
  }
  const post = await getPostByPublicId(container.sqlDb, "" + idOrSlug);
  return post.id;
};
