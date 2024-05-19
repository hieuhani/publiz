import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createReactionCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "reactions");
