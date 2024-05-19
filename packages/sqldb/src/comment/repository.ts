import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createCommentCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "comments");

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
