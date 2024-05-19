import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";

export const createReactionPackCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "reaction_packs");

export const findReactionPacksByUserId = async (
  db: SqlDatabase,
  userId: number
) => {
  return db
    .selectFrom("reaction_packs")
    .selectAll("reaction_packs")
    .innerJoin(
      "reaction_packs_users",
      "reaction_packs.id",
      "reaction_packs_users.reactionPackId"
    )
    .where("reaction_packs_users.userId", "=", userId)
    .execute();
};

export const getReactionPackBySlugAndOrganizationId = async (
  db: SqlDatabase,
  slug: string,
  organizationId: number | null
) => {
  let query = db
    .selectFrom("reaction_packs")
    .selectAll("reaction_packs")
    .where("slug", "=", slug);

  if (organizationId === null) {
    query = query.where("organizationId", "is", null);
  } else {
    query = query.where("organizationId", "=", organizationId);
  }
  return query.executeTakeFirstOrThrow();
};
