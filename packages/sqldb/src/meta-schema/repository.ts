import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { MetaSchemaRow, MetaSchemaTable } from "./model";

export const createMetaSchemaCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<MetaSchemaTable>(db, "meta_schemas");

export const findMetaSchemasByOrganizationId = (
  db: SqlDatabase,
  organizationId: number
): Promise<MetaSchemaRow[]> => {
  return db
    .selectFrom("meta_schemas")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .execute();
};
