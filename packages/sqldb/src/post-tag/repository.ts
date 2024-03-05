import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { PostTagTable } from "./model";

export const createPostTagCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<PostTagTable>(db, "posts_tags");

export const findPostTagsByPostId = async (db: SqlDatabase, postId: number) => {
  return db
    .selectFrom("posts_tags")
    .selectAll()
    .where("postId", "=", postId)
    .execute();
};
