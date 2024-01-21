import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type OrganizationUserTable = {
  id: Generated<number>;
  userId: number;
  organizationId: number;
  organizationRoleId: number;
};

export type OrganizationUserRow = Selectable<OrganizationUserTable>;
export type InsertableOrganizationUserRow = Insertable<OrganizationUserTable>;
export type UpdateableOrganizationUserRow = Updateable<OrganizationUserTable>;
