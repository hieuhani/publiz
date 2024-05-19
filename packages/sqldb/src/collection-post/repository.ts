import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { CollectionPostRow } from "./model";

export const createCollectionPostCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "collections_posts");

export const getCollectionPostByCollectionIdAndPostId = (
  db: SqlDatabase,
  collectionId: number,
  postId: number
): Promise<CollectionPostRow> => {
  return db
    .selectFrom("collections_posts")
    .selectAll()
    .where("collectionId", "=", collectionId)
    .where("postId", "=", postId)
    .executeTakeFirstOrThrow();
};

export const deleteCollectionPostByCollectionIdAndPostId = (
  db: SqlDatabase,
  collectionId: number,
  postId: number
) => {
  return db
    .deleteFrom("collections_posts")
    .where("collectionId", "=", collectionId)
    .where("postId", "=", postId)
    .execute();
};

export const findPostsByCollectionId = (
  sqlDb: SqlDatabase,
  collectionId: number
) => {
  return sqlDb
    .selectFrom("posts")
    .selectAll("posts")
    .innerJoin("collections_posts", "posts.id", "collections_posts.postId")
    .where("collections_posts.collectionId", "=", collectionId)
    .orderBy("collections_posts.updatedAt", "desc")
    .execute();
};
