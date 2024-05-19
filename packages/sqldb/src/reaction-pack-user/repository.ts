import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createReactionPackUserCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "reaction_packs_users");

export const getReactionPackUsersByUserIdAndReactionPackId = async (
  db: SqlDatabase,
  userId: number,
  reactionPackId: number
) => {
  return db
    .selectFrom("reaction_packs_users")
    .selectAll()
    .where("userId", "=", userId)
    .where("reactionPackId", "=", reactionPackId)
    .execute();
};
