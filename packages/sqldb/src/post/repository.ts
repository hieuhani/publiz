import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
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
