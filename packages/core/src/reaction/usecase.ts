import { getContentModerationApproveReaction as getContentModerationApproveReactionRepo } from "@publiz/sqldb";
import { Container } from "../container";
import { createCrudUseCase } from "../crud";

export const createReactionUseCase = (container: Container) =>
  createCrudUseCase(container, "reactions");

export const getContentModerationApproveReaction = async (
  container: Container
) => {
  return getContentModerationApproveReactionRepo(container.sqlDb);
};
