import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { CommentRow } from "./model";

export const createCommentCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "comments");

export const findCommentsByTargetAndTargetId = (
  db: SqlDatabase,
  target: string,
  targetId: number
): Promise<CommentRow[]> => {
  return db
    .selectFrom("comments")
    .selectAll()
    .where("target", "=", target)
    .where("targetId", "=", targetId)
    .execute();
};
