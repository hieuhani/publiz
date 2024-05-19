import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createReactionPostCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "reactions_posts");
