import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type TagType = "SYSTEM" | "DEFAULT";
export type TagTable = {
  id: Generated<number>;
  name: string;
  slug: string;
  description?: string;
  type: TagType;
  organizationId?: number;
  parentId?: number;
  taxonomyId?: number;
  userId: number;
};

export type TagRow = Selectable<TagTable>;
export type InsertableTagRow = Insertable<TagTable>;
export type UpdateableTagRow = Updateable<TagTable>;
