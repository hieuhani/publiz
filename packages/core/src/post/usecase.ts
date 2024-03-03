import {
  type InsertablePostRow,
  createPostCrudRepository,
  getPostByIdAndUserId,
  UpdateablePostRow,
  getPostByIdAndOrganizationId,
  getPostById as getPostByIdRepo,
  findPostsByOrganizationId as findPostsByOrganizationIdRepo,
  findMyPostsByMetaSchemaId as findMyPostsByMetaSchemaIdRRepo,
  createPostTagCrudRepository,
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
};
export const updatePost = async (
  container: Container,
  id: number,
  { metaSchemaId, ...input }: UpdatePostInput
) => {
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(input.metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
    }
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
