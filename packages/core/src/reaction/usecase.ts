import { Container } from "../container";
import { createCrudUseCase } from "../crud";

export const createReactionUseCase = (container: Container) =>
  createCrudUseCase(container, "reactions");
