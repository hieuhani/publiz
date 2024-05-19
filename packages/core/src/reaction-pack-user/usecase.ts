import { Container } from "../container";
import { createCrudUseCase } from "../crud";

export const createReactionPackUserUseCase = (container: Container) =>
  createCrudUseCase(container, "reaction_packs_users");
