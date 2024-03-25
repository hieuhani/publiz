import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type TaxonomyType = "SYSTEM" | "DEFAULT";

export type TaxonomyTable = {
  id: Generated<number>;
  name: string;
  slug: string;
  type: TaxonomyType;
  organizationId?: number;
  userId: number;
};

export type TaxonomyRow = Selectable<TaxonomyTable>;
export type InsertableTaxonomyRow = Insertable<TaxonomyTable>;
export type UpdateableTaxonomyRow = Updateable<TaxonomyTable>;
