import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type OrganizationTable = {
  id: Generated<number>;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  verified: boolean;
  ownerId: number;
};

export type OrganizationRow = Selectable<OrganizationTable>;
export type InsertableOrganizationRow = Insertable<OrganizationTable>;
export type UpdateableOrganizationRow = Updateable<OrganizationTable>;
