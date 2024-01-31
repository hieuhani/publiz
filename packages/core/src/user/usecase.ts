import {
  type InsertableUserRow,
  createUserCrudRepository,
  findUserByAuthId,
} from "@publiz/sqldb";
import Ajv from "ajv";

import { Container } from "../container";
import { getMetaSchemaById } from "../meta-schema";
import { AppError } from "../error";

const ajv = new Ajv();

type GetMyProfileInput = {
  authId: string;
};

export const getMyProfile = async (
  container: Container,
  { authId }: GetMyProfileInput
) => {
  return findUserByAuthId(container.sqlDb, authId);
};

type CreateUserInput = InsertableUserRow;

export const createUser = async (
  container: Container,
  input: CreateUserInput
) => {
  return createUserCrudRepository(container.sqlDb).create(input);
};

type UpdateUserInput = Omit<
  InsertableUserRow & {
    metaSchemaId?: number;
  },
  "authId"
>;

export const updateUser = async (
  container: Container,
  id: number,
  { metaSchemaId, ...input }: UpdateUserInput
) => {
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(input.metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
    }
  }
  return createUserCrudRepository(container.sqlDb).update(id, input);
};

export const getUsers = async (container: Container) =>
  createUserCrudRepository(container.sqlDb).find();
