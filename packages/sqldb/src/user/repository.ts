import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { UserRow } from "./model";

export const createUserCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "users");

export const findUserByAuthId = (
  db: SqlDatabase,
  authId: string
): Promise<UserRow | undefined> => {
  return db
    .selectFrom("users")
    .selectAll()
    .where("authId", "=", authId)
    .executeTakeFirst();
};
