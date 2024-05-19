import { Container } from "../container";
import { createCrudUseCase } from "../crud";

export const createReactionPackUseCase = (container: Container) =>
  createCrudUseCase(container, "reaction_packs");
