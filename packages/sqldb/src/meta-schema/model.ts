import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type MetaSchemaTable = {
  id: Generated<number>;
  name: string;
  schema: string;
  target: string;
  organizationId?: number;
};

export type MetaSchemaRow = Selectable<MetaSchemaTable>;
export type InsertableMetaSchemaRow = Insertable<MetaSchemaTable>;
export type UpdateableMetaSchemaRow = Updateable<MetaSchemaTable>;
