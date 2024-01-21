import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import {
  OrganizationRoleRow,
  OrganizationRoleTable,
  UpdateableOrganizationRoleRow,
} from "./model";

export const createOrganizationRoleCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<OrganizationRoleTable>(db, "organization_roles");

export const findOrganizationRolesByOrganizationId = (
  db: SqlDatabase,
  id: number
): Promise<OrganizationRoleRow[]> => {
  return db
    .selectFrom("organization_roles")
    .selectAll()
    .where("organizationId", "=", id)
    .execute();
};

export const deleteOrganizationRoleByIdAndOrganizationId = (
  db: SqlDatabase,
  id: number,
  organizationId: number
) => {
  return db
    .deleteFrom("organization_roles")
    .where("id", "=", id)
    .where("organizationId", "=", organizationId)
    .executeTakeFirstOrThrow();
};

export const updateOrganizationRoleByIdAndOrganizationId = (
  db: SqlDatabase,
  id: number,
  organizationId: number,
  input: UpdateableOrganizationRoleRow
) => {
  return db
    .updateTable("organization_roles")
    .set(input)
    .where("id", "=", id)
    .where("organizationId", "=", organizationId)
    .executeTakeFirstOrThrow();
};
