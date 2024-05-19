import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createReactionPackUserCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "reaction_packs_users");
