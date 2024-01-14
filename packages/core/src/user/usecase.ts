import {
  type InsertableUserRow,
  createUserCrudRepository,
  findUserByAuthId,
} from "@publiz/sqldb";
import { Container } from "../container";

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
