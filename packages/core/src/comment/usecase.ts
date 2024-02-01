import {
  type InsertableCommentRow,
  type UpdateableCommentRow,
  createCommentCrudRepository,
} from "@publiz/sqldb";
import Ajv from "ajv";
import { Container } from "../container";
import { getMetaSchemaById } from "../meta-schema";
import { AppError } from "../error";

const ajv = new Ajv();

export type CreateCommentInput = InsertableCommentRow & {
  metadata?: any;
  metaSchemaId?: number;
};

export const createComment = async (
  container: Container,
  { metaSchemaId, ...input }: CreateCommentInput
) => {
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(input.metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
    }
    (input.metadata as any).metaSchemaId = metaSchemaId;
  }
  return createCommentCrudRepository(container.sqlDb).create(input);
};

export type UpdateCommentInput = UpdateableCommentRow & {
  metadata?: any;
  metaSchemaId?: number;
};
export const updateComment = async (
  container: Container,
  id: number,
  { metaSchemaId, ...input }: UpdateCommentInput
) => {
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(input.metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
    }
  }
  return createCommentCrudRepository(container.sqlDb).update(id, input);
};
