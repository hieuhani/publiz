import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { CommentTable } from "./model";

export const createCommentCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<CommentTable>(db, "comments");

export const findCommentsByTargetAndTargetId = (
  db: SqlDatabase,
  target: string,
  targetId: number
) =>
  db
    .selectFrom("comments")
    .where("target", "=", target)
    .where("targetId", "=", targetId)
    .execute();
