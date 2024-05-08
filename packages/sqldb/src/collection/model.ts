import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type CollectionType = "SYSTEM" | "DEFAULT";
export type CollectionTable = {
  id: Generated<number>;
  name: string;
  slug: string;
  type: CollectionType;
  organizationId?: number;
  userId: number;
};

export type CollectionRow = Selectable<CollectionTable>;
export type InsertableCollectionRow = Insertable<CollectionTable>;
export type UpdateableCollectionRow = Updateable<CollectionTable>;
