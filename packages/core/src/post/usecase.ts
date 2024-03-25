import {
  type InsertablePostRow,
  createPostCrudRepository,
  getPostByIdAndUserId,
  UpdateablePostRow,
  getPostByIdAndOrganizationId,
  getPostById as getPostByIdRepo,
  findPostsByOrganizationId as findPostsByOrganizationIdRepo,
  findMyPostsByMetaSchemaId as findMyPostsByMetaSchemaIdRRepo,
  findPostsByMetaSchemaId as findPostsByMetaSchemaIdRepo,
  createPostTagCrudRepository,
  findPostTagsByPostId,
} from "@publiz/sqldb";
import Ajv from "ajv";
import { Container } from "../container";
import { getMetaSchemaById } from "../meta-schema";
import { AppError } from "../error";
import { findTagsByIds } from "../tag";

const ajv = new Ajv();

type CreatePostInput = InsertablePostRow & {
  metadata?: any;
  metaSchemaId?: number;
  tagIds?: number[];
};

export const createPost = async (
  container: Container,
  { metaSchemaId, tagIds = [], ...input }: CreatePostInput
) => {
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(input.metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
    }
    (input.metadata as any).metaSchemaId = metaSchemaId;
  }

  if (tagIds.length > 0) {
    const tags = await findTagsByIds(container, tagIds);
    const availableTags = tags.filter(
      (tag) =>
        tag.type === "SYSTEM" || tag.organizationId === input.organizationId
    );
    if (availableTags.length > 0) {
      return container.sqlDb.transaction().execute(async (trx) => {
        const post = await createPostCrudRepository(trx).create(input);
        await createPostTagCrudRepository(trx).createMulti(
          availableTags.map((tag) => ({ postId: post.id, tagId: tag.id }))
        );
        return post;
      });
    }
  }

  return createPostCrudRepository(container.sqlDb).create(input);
};

export const getMyPostById = async (
  container: Container,
  userId: number,
  postId: number
) => {
  return getPostByIdAndUserId(container.sqlDb, postId, userId);
};

export const getMyPostsByMetaSchemaId = async (
  container: Container,
  userId: number,
  metaSchemaId: number
) => {
  return findMyPostsByMetaSchemaIdRRepo(container.sqlDb, userId, metaSchemaId);
};

export const getOrganizationPostById = async (
  container: Container,
  organizationId: number,
  postId: number
) => {
  return getPostByIdAndOrganizationId(container.sqlDb, postId, organizationId);
};

type UpdatePostInput = UpdateablePostRow & {
  metadata?: any;
  metaSchemaId?: number;
  tagIds?: number[];
};
export const updatePost = async (
  container: Container,
  id: number,
  { metaSchemaId, tagIds, ...input }: UpdatePostInput
) => {
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(input.metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
    }
    (input.metadata as any).metaSchemaId = metaSchemaId;
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
      return createPostCrudRepository(trx).update(id, input);
    });
  }
  return createPostCrudRepository(container.sqlDb).update(id, input);
};

export const getPostById = async (container: Container, id: number) => {
  return getPostByIdRepo(container.sqlDb, id);
};

export const findPostsByOrganizationId = async (
  container: Container,
  organizationId: number
) => {
  return findPostsByOrganizationIdRepo(container.sqlDb, organizationId);
};

type FindPostsByMetaSchemaIdPayload = {
  metaSchemaId: number;
  after?: string;
  before?: string;
  size?: number;
};
export const findPostsByMetaSchemaId = async (
  container: Container,
  { metaSchemaId, after, before, size }: FindPostsByMetaSchemaIdPayload
) => {
  return findPostsByMetaSchemaIdRepo(
    container.sqlDb,
    metaSchemaId,
    after,
    before,
    size
  );
};

export const bulkCreatePosts = async (
  container: Container,
  records: InsertablePostRow[]
) => {
  return container.sqlDb.transaction().execute(async (trx) => {
    return createPostCrudRepository(trx).createMulti(records);
  });
};

export const deletePost = async (container: Container, id: number) => {
  return createPostCrudRepository(container.sqlDb).delete(id);
};
