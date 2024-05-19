import { Database, createCrudRepository } from "@publiz/sqldb";
import { Container } from "../container";

export const createCrudUseCase = <M extends keyof Database>(
  container: Container,
  model: M
) => createCrudRepository(container.sqlDb, model);
