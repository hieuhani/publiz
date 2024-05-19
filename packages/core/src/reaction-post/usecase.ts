import { Container } from "../container";
import { createCrudUseCase } from "../crud";

export const createReactionPostCrudUseCase = (container: Container) =>
  createCrudUseCase(container, "reactions_posts");
