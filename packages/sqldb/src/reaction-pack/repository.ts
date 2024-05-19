import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createReactionPackCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "reaction_packs");
