import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { OrganizationUserRow, OrganizationUserTable } from "./model";

export const createOrganizationUserCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<OrganizationUserTable>(db, "organizations_users");

export const getOrganizationUsersByOrganizationId = (
  db: SqlDatabase,
  organizationId: number
): Promise<OrganizationUserRow[]> => {
  return db
    .selectFrom("organizations_users")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .execute();
};

export const getOrganizationUsersByUserId = (
  db: SqlDatabase,
  userId: number
): Promise<OrganizationUserRow[]> => {
  return db
    .selectFrom("organizations_users")
    .selectAll()
    .where("userId", "=", userId)
    .execute();
};
