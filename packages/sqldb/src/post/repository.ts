import { jsonArrayFrom } from "kysely/helpers/postgres";
import { createCrudRepository } from "../crud";
import { Database, SqlDatabase } from "../database";
import { JsonValue } from "../kysely";
import { PostTable } from "./model";
import { ExpressionBuilder } from "kysely";
import { executeWithCursorPagination } from "../pagination/cursor";

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
    .select(withTags)
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
    .select(withTags)
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
    .select(withTags)
    .where("authorId", "=", userId)
    .where("metadata", "@>", new JsonValue({ metaSchemaId }))
    .execute();
};

export const getPostById = async (db: SqlDatabase, postId: number) => {
  return db
    .selectFrom("posts")
    .selectAll()
    .select(withTags)
    .where("id", "=", postId)
    .executeTakeFirstOrThrow();
};

export const findPostsByMetaSchemaId = async (
  db: SqlDatabase,
  metaSchemaId: number,
  after?: string,
  before?: string,
  size: number = 10
) => {
  const query = db
    .selectFrom("posts")
    .selectAll()
    .select(withTags)
    .where("metadata", "@>", new JsonValue({ metaSchemaId }));

  return executeWithCursorPagination(query, {
    perPage: size,
    after,
    before,
    fields: [
      { expression: "id", direction: "asc" },
      { expression: "updatedAt", direction: "desc" },
    ],
    parseCursor: (cursor) => ({
      id: parseInt(cursor.id, 10),
      updatedAt: cursor.updatedAt,
    }),
  });
};

const withTags = (eb: ExpressionBuilder<Database, "posts">) =>
  jsonArrayFrom(
    eb
      .selectFrom("tags")
      .select([
        "tags.id",
        "tags.name",
        "tags.slug",
        "tags.type",
        "tags.parentId",
      ])
      .innerJoin("posts_tags", "posts_tags.tagId", "tags.id")
      .whereRef("posts_tags.postId", "=", "posts.id")
  ).as("tags");
