import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type OrganizationTable = {
  id: Generated<number>;
  name: string;
  slug: string;
  description: string;
  verified: boolean;
  ownerId: number;
  metadata: any;
};

export type OrganizationRow = Selectable<OrganizationTable>;
export type InsertableOrganizationRow = Insertable<OrganizationTable>;
export type UpdateableOrganizationRow = Updateable<OrganizationTable>;
