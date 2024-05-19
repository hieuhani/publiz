import { getReactionPackUsersByUserIdAndReactionPackId as getReactionPackUsersByUserIdAndReactionPackIdRepo } from "@publiz/sqldb";
import { Container } from "../container";
import { createCrudUseCase } from "../crud";

export const createReactionPackUserUseCase = (container: Container) =>
  createCrudUseCase(container, "reaction_packs_users");

export const getReactionPackUsersByUserIdAndReactionPackId = async (
  container: Container,
  userId: number,
  reactionPackId: number
) => {
  return getReactionPackUsersByUserIdAndReactionPackIdRepo(
    container.sqlDb,
    userId,
    reactionPackId
  );
};
