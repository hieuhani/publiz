import {
  type InsertablePostRow,
  createPostCrudRepository,
  getPostByIdAndUserId,
  UpdateablePostRow,
} from "@publiz/sqldb";
import Ajv from "ajv";
import { Container } from "../container";
import { getMetaSchemaById } from "../meta-schema";
import { AppError } from "../error";

const ajv = new Ajv();

type CreatePostInput = InsertablePostRow & {
  metadata?: any;
  metaSchemaId?: number;
};
export const createPost = async (
  container: Container,
  { metaSchemaId, ...input }: CreatePostInput
) => {
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(input.metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
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
