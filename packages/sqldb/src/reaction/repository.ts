import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createReactionCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "reactions");

export const getContentModerationApproveReaction = async (db: SqlDatabase) => {
  return db
    .selectFrom("reactions")
    .selectAll("reactions")
    .innerJoin(
      "reaction_packs",
      "reactions.reactionPackId",
      "reaction_packs.id"
    )
    .where("reaction_packs.slug", "=", "content-moderation")
    .where("reactions.code", "=", "approve")
    .executeTakeFirstOrThrow();
};
