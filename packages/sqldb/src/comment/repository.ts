import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { CommentTable } from "./model";

export const createCommentCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<CommentTable>(db, "comments");
