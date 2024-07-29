import {
  type InsertableCommentRow,
  type UpdateableCommentRow,
  createCommentCrudRepository,
  findCommentsByTargetAndTargetId as findCommentsByTargetAndTargetIdRepository,
} from "@publiz/sqldb";
import { Validator } from "@cfworker/json-schema";
import { Container } from "../container";
import { getMetaSchemaByIdentifier } from "../meta-schema";
import { AppError } from "../error";

export type CreateCommentInput = InsertableCommentRow & {
  metadata?: any;
  metaSchema?: string;
};

export const createComment = async (
  container: Container,
  { metaSchema: metaSchemaIdentifier, ...input }: CreateCommentInput
) => {
  if (metaSchemaIdentifier) {
    const metaSchema = await getMetaSchemaByIdentifier(
      container,
      metaSchemaIdentifier
    );
    const validator = new Validator(metaSchema.schema);

    const result = validator.validate(input.metadata);

    if (!result.valid) {
      throw new AppError(400_102, "Invalid metadata", result.errors);
    }
    (input.metadata as any).metaSchema = metaSchemaIdentifier;
  }
  return createCommentCrudRepository(container.sqlDb).create(input);
};

export type UpdateCommentInput = UpdateableCommentRow & {
  metadata?: any;
  metaSchema?: string;
};
export const updateComment = async (
  container: Container,
  id: number,
  { metaSchema: metaSchemaIdentifier, ...input }: UpdateCommentInput
) => {
  if (metaSchemaIdentifier) {
    const metaSchema = await getMetaSchemaByIdentifier(
      container,
      metaSchemaIdentifier
    );
    const validator = new Validator(metaSchema.schema);

    const result = validator.validate(input.metadata);

    if (!result.valid) {
      throw new AppError(400_102, "Invalid metadata", result.errors);
    }
    (input.metadata as any).metaSchema = metaSchemaIdentifier;
  }
  return createCommentCrudRepository(container.sqlDb).update(id, input);
};

export const findCommentsByTargetAndTargetId = async (
  container: Container,
  target: string,
  targetId: number
) => {
  return findCommentsByTargetAndTargetIdRepository(
    container.sqlDb,
    target,
    targetId
  );
};
