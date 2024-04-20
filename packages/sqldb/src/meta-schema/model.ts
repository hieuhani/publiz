import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type MetaSchemaType = "SYSTEM" | "DEFAULT";
export type MetaSchemaTable = {
  id: Generated<number>;
  name: string;
  schema: object;
  version: number;
  target: string;
  type: MetaSchemaType;
  isDefault?: boolean;
  organizationId?: number;
};

export type MetaSchemaRow = Selectable<MetaSchemaTable>;
export type InsertableMetaSchemaRow = Insertable<MetaSchemaTable>;
export type UpdateableMetaSchemaRow = Updateable<MetaSchemaTable>;
