import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { OrganizationRow, OrganizationTable } from "./model";

export const createOrganizationCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<OrganizationTable>(db, "organizations");

export const getOrganizationBySlug = (
  db: SqlDatabase,
  slug: string
): Promise<OrganizationRow> => {
  return db
    .selectFrom("organizations")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirstOrThrow();
};

export const findWorkingOrganizationsByUserId = async (
  db: SqlDatabase,
  userId: number
) => {
  const organizationWithUsers = await db
    .selectFrom("organizations")
    .selectAll(["organizations"])
    .innerJoin(
      "organizations_users",
      "organizations_users.organizationId",
      "organizations.id"
    )
    .select(["organizations_users.organizationRoleId"])
    .where("organizations_users.userId", "=", userId)
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
