import {
  findReactionPacksByUserId as findReactionPacksByUserIdRepo,
  getReactionPackBySlugAndOrganizationId as getReactionPackBySlugAndOrganizationIdRepo,
} from "@publiz/sqldb";
import { Container } from "../container";
import { createCrudUseCase } from "../crud";

export const createReactionPackUseCase = (container: Container) =>
  createCrudUseCase(container, "reaction_packs");

export const getMyReactionPacks = async (
  container: Container,
  userId: number
) => {
  return findReactionPacksByUserIdRepo(container.sqlDb, userId);
};

export const getReactionPackBySlugAndOrganizationId = async (
  container: Container,
  slug: string,
  organizationId: number | null
) => {
  return getReactionPackBySlugAndOrganizationIdRepo(
    container.sqlDb,
    slug,
    organizationId
  );
};
