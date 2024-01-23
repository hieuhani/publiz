import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { OrganizationUserRow, OrganizationUserTable } from "./model";

export const createOrganizationUserCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<OrganizationUserTable>(db, "organizations_users");

export const findOrganizationUsersByOrganizationId = (
  db: SqlDatabase,
  organizationId: number
): Promise<OrganizationUserRow[]> => {
  return db
    .selectFrom("organizations_users")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .execute();
};

export const findOrganizationUsersByUserId = (
  db: SqlDatabase,
  userId: number
): Promise<OrganizationUserRow[]> => {
  return db
    .selectFrom("organizations_users")
    .selectAll()
    .where("userId", "=", userId)
    .execute();
};

export const findOrganizationUsersByOrganizationIdAndUserId = (
  db: SqlDatabase,
  organizationId: number,
  userId: number
): Promise<OrganizationUserRow[]> => {
  return db
    .selectFrom("organizations_users")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .where("userId", "=", userId)
    .execute();
};

export const findOrganizationWorkingUsers = async (
  db: SqlDatabase,
  organizationId: number
) => {
  const organizationWithUsers = await db
    .selectFrom("users")
    .selectAll(["users"])
    .innerJoin("organizations_users", "organizations_users.userId", "users.id")
    .select(["organizations_users.organizationRoleId"])
    .where("organizations_users.organizationId", "=", organizationId)
    .execute();

  return Object.values(
    organizationWithUsers.reduce<{
      [id: number]: Omit<
        (typeof organizationWithUsers)[0],
        "organizationRoleId"
      > & {
        organizationRoleIds: number[];
      };
    }>((prev, { organizationRoleId, ...current }) => {
      return {
        ...prev,
        [current.id]: {
          ...current,
          organizationRoleIds: [
            ...(prev[current.id]?.organizationRoleIds || []),
            organizationRoleId,
          ],
        },
      };
    }, {})
  );
};
