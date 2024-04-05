import {
  type InsertableCommentRow,
  type UpdateableCommentRow,
  createCommentCrudRepository,
} from "@publiz/sqldb";
import { Validator } from "@cfworker/json-schema";
import { Container } from "../container";
import { getMetaSchemaById } from "../meta-schema";
import { AppError } from "../error";

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
    const validator = new Validator(metaSchema.schema);

    const result = validator.validate(input.metadata);

    if (!result.valid) {
      throw new AppError(400_102, "Invalid metadata", result.errors);
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
    const validator = new Validator(metaSchema.schema);

    const result = validator.validate(input.metadata);

    if (!result.valid) {
      throw new AppError(400_102, "Invalid metadata", result.errors);
    }
  }
  return createCommentCrudRepository(container.sqlDb).update(id, input);
};
