import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type UserTable = {
  id: Generated<number>;
  authId: string;
  displayName: string;
  metadata: any;
  rolesMask?: number;
  updatedAt?: string;
};

export type UserRow = Selectable<UserTable>;
export type InsertableUserRow = Insertable<UserTable>;
export type UpdateableUserRow = Updateable<UserTable>;
