import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createPostTagCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "posts_tags");

export const findPostTagsByPostId = async (db: SqlDatabase, postId: number) => {
  return db
    .selectFrom("posts_tags")
    .selectAll()
    .where("postId", "=", postId)
    .execute();
};
