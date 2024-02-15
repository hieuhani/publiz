import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { JsonValue } from "../kysely";
import { PostTable } from "./model";

export const createPostCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<PostTable>(db, "posts");

export const getPostByIdAndUserId = async (
  db: SqlDatabase,
  postId: number,
  authorId: number
) => {
  return db
    .selectFrom("posts")
    .selectAll()
    .where("id", "=", postId)
    .where("authorId", "=", authorId)
    .executeTakeFirstOrThrow();
};

export const getPostByIdAndOrganizationId = async (
  db: SqlDatabase,
  postId: number,
  organizationId: number
) => {
  return db
    .selectFrom("posts")
    .selectAll()
    .where("id", "=", postId)
    .where("organizationId", "=", organizationId)
    .executeTakeFirstOrThrow();
};

export const findPostsByOrganizationId = async (
  db: SqlDatabase,
  organizationId: number
) => {
  return db
    .selectFrom("posts")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .execute();
};

export const findMyPostsByMetaSchemaId = async (
  db: SqlDatabase,
  userId: number,
  metaSchemaId: number
) => {
  return db
    .selectFrom("posts")
    .selectAll()
    .where("authorId", "=", userId)
    .where("metadata", "@>", new JsonValue({ metaSchemaId }))
    .execute();
};
