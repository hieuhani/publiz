import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createCollectionCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "collections");

export const getCollectionByIdAndUserId = async (
  db: SqlDatabase,
  tagId: number,
  userId: number
) => {
  return db
    .selectFrom("collections")
    .selectAll()
    .where("id", "=", tagId)
    .where("userId", "=", userId)
    .executeTakeFirstOrThrow();
};

export const findCollectionsByUserId = async (
  db: SqlDatabase,
  userId: number
) => {
  return db
    .selectFrom("collections")
    .selectAll()
    .where("userId", "=", userId)
    .execute();
};

export const getOrganizationCollectionById = async (
  db: SqlDatabase,
  organizationId: number,
  id: number
) => {
  return db
    .selectFrom("collections")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};

export const findCollectionsByOrganizationId = async (
  db: SqlDatabase,
  organizationId: number
) => {
  return db
    .selectFrom("collections")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .execute();
};

export const findSystemCollections = async (db: SqlDatabase) => {
  return db
    .selectFrom("collections")
    .selectAll()
    .where("type", "=", "SYSTEM")
    .execute();
};

export const getCollectionBySlug = async (db: SqlDatabase, slug: string) => {
  return db
    .selectFrom("collections")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirstOrThrow();
};
