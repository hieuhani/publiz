import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type MetaSchemaTable = {
  id: Generated<number>;
  name: string;
  schema: object;
  target: string;
  isDefault?: boolean;
  organizationId?: number;
};

export type MetaSchemaRow = Selectable<MetaSchemaTable>;
export type InsertableMetaSchemaRow = Insertable<MetaSchemaTable>;
export type UpdateableMetaSchemaRow = Updateable<MetaSchemaTable>;
