import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { createCrudRepository } from "../crud";
import { Database, SqlDatabase } from "../database";
import { ExpressionBuilder } from "kysely";
import { executeWithCursorPagination } from "../pagination/cursor";
import { PostRow } from "./model";

export const createPostCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "posts");

export const getPostByPublicId = (
  db: SqlDatabase,
  publicId: string
): Promise<PostRow> => {
  return db
    .selectFrom("posts")
    .selectAll()
    .where("publicId", "=", publicId)
    .executeTakeFirstOrThrow();
};

export const getPostByIdAndUserId = async (
  db: SqlDatabase,
  postId: number,
  authorId: number
) => {
  return db
    .selectFrom("posts")
    .selectAll()
    .select(withTags)
    .where("id", "=", postId)
    .where("authorId", "=", authorId)
    .executeTakeFirstOrThrow();
};

export const getPostsByUserId = async (db: SqlDatabase, authorId: number) => {
  return db
    .selectFrom("posts")
    .selectAll()
    .where("authorId", "=", authorId)
    .orderBy("createdAt", "desc")
    .execute();
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

export const getPostById = async (
  db: SqlDatabase,
  postId: number | string,
  context: {
    withOrganization?: boolean;
  } = {
      withOrganization: false,
    }
) => {
  let query = db
    .selectFrom("posts")
    .selectAll()
    .select(withTags)
    .select(withAuthor);
  if (Number.isInteger(postId)) {
    query = query.where("id", "=", +postId);
  } else {
    query = query.where("publicId", "=", String(postId));
  }

  if (context.withOrganization) {
    query = query.select(withOrganization);
  }

  return query.executeTakeFirstOrThrow();
};

export const findPosts = async (
  db: SqlDatabase,
  {
    organizationId,
    metaSchemaId,
    metaSchema,
    collectionId,
    taxonomyId,
    tagId,
    userId,
    reactionId,
  }: {
    organizationId?: number;
    // Deprecated
    metaSchemaId?: number;
    metaSchema?: string;
    collectionId?: number;
    taxonomyId?: number;
    tagId?: number;
    userId?: number;
    reactionId?: number | null;
  },
  {
    after,
    before,
    size = 10,
  }: { after?: string; before?: string; size?: number },
  context: {
    withOrganization?: boolean;
  } = {
      withOrganization: false,
    }
) => {
  let query = db
    .selectFrom("posts")
    .selectAll("posts")
    .distinctOn(["posts.id", "posts.createdAt"])
    .select(withAuthor);

  if (context.withOrganization) {
    query = query.select(withOrganization);
  }

  if (organizationId !== undefined) {
    if (organizationId === 0) {
      query = query.where("organizationId", "is", null);
    } else {
      query = query.where("organizationId", "=", organizationId);
    }
  }

  if (userId) {
    query = query.where("authorId", "=", userId);
  }

  if (taxonomyId && tagId) {
    query = query
      .innerJoin("posts_tags", "posts.id", "posts_tags.postId")
      .innerJoin("tags", "tags.id", "posts_tags.tagId")
      .where("tags.taxonomyId", "=", taxonomyId)
      .where("posts_tags.tagId", "=", tagId);
  } else if (taxonomyId) {
    query = query
      .innerJoin("posts_tags", "posts.id", "posts_tags.postId")
      .innerJoin("tags", "tags.id", "posts_tags.tagId")
      .where("tags.taxonomyId", "=", taxonomyId);
  } else if (tagId) {
    query = query
      .innerJoin("posts_tags", "posts.id", "posts_tags.postId")
      .where("posts_tags.tagId", "=", tagId);
  }

  if (metaSchemaId) {
    console.warn("metaSchemaId is deprecated, use metaSchema instead");
  }

  if (metaSchema) {
    query = query.where("metaSchema", "=", metaSchema);
  }

  if (collectionId) {
    query = query
      .innerJoin("collections_posts", "posts.id", "collections_posts.postId")
      .distinctOn(["collections_posts.updatedAt"])
      .where("collections_posts.collectionId", "=", collectionId)
      .orderBy("collections_posts.updatedAt", "desc");
  }

  if (reactionId === null) {
    query = query
      .leftJoin("reactions_posts", "posts.id", "reactions_posts.postId")
      .where("reactions_posts.reactionId", "is", null);
  } else if (reactionId) {
    query = query
      .innerJoin("reactions_posts", "posts.id", "reactions_posts.postId")
      .where("reactions_posts.reactionId", "=", reactionId);
  }

  query = query.orderBy("posts.createdAt desc");

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

const withAuthor = (eb: ExpressionBuilder<Database, "posts">) =>
  jsonObjectFrom(
    eb
      .selectFrom("users")
      .select(["users.id", "users.displayName", "users.metadata"])
      .whereRef("users.id", "=", "posts.authorId")
  ).as("author");

const withOrganization = (eb: ExpressionBuilder<Database, "posts">) =>
  jsonObjectFrom(
    eb
      .selectFrom("organizations")
      .selectAll("organizations")
      .whereRef("organizations.id", "=", "posts.organizationId")
  ).as("organization");

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
