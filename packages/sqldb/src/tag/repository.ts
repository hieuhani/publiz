import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { TagTable } from "./model";

export const createTagCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<TagTable>(db, "tags");

export const getTagByIdAndUserId = async (
  db: SqlDatabase,
  tagId: number,
  userId: number
) => {
  return db
    .selectFrom("tags")
    .selectAll()
    .where("id", "=", tagId)
    .where("userId", "=", userId)
    .executeTakeFirstOrThrow();
};

export const findTagsByUserId = async (db: SqlDatabase, userId: number) => {
  return db
    .selectFrom("tags")
    .selectAll()
    .where("userId", "=", userId)
    .execute();
};

export const findTagsByOrganizationId = async (
  db: SqlDatabase,
  organizationId: number
) => {
  return db
    .selectFrom("tags")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .execute();
};
