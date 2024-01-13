import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { PostTagTable } from "./model";

export const createPostTagCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<PostTagTable>(db, "posts_tags");
