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

export const getOrganizationTagById = async (
  db: SqlDatabase,
  organizationId: number,
  id: number
) => {
  return db
    .selectFrom("tags")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};

export const findTagsByTaxonomyId = async (
  db: SqlDatabase,
  taxonomyId: number
) => {
  return db
    .selectFrom("tags")
    .selectAll()
    .where("taxonomyId", "=", taxonomyId)
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

export const findSystemTags = async (db: SqlDatabase) => {
  return db
    .selectFrom("tags")
    .selectAll()
    .where("type", "=", "SYSTEM")
    .execute();
};

export const findOrganizationRelatedTags = async (
  db: SqlDatabase,
  organizationId: number
) => {
  return db
    .selectFrom("tags")
    .selectAll("tags")
    .rightJoin("posts_tags", "posts_tags.tagId", "tags.id")
    .innerJoin("posts", "posts.id", "posts_tags.postId")
    .where("posts.organizationId", "=", organizationId)
    .distinctOn("tags.id")
    .execute();
};
