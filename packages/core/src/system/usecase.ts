import {
  getDatabaseMigrations as getDatabaseMigrationsRepo,
  executeInitialMigration as executeInitialMigrationRepo,
} from "@publiz/sqldb";
import { Container } from "../container";

export const getDatabaseMigrations = async (container: Container) => {
  return getDatabaseMigrationsRepo(container.sqlDb);
};

export const executeInitialMigration = async (container: Container) => {
  return executeInitialMigrationRepo(container.sqlDb);
};
