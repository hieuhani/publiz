import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type OrganizationRoleTable = {
  id: Generated<number>;
  name: string;
  organizationId: number;
};

export type OrganizationRoleRow = Selectable<OrganizationRoleTable>;
export type InsertableOrganizationRoleRow = Insertable<OrganizationRoleTable>;
export type UpdateableOrganizationRoleRow = Updateable<OrganizationRoleTable>;
