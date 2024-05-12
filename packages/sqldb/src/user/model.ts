import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type UserTable = {
  id: Generated<number>;
  authId: string;
  displayName: string;
  avatarUrl?: string;
  metadata: any;
  updatedAt?: string;
};

export type UserRow = Selectable<UserTable>;
export type InsertableUserRow = Insertable<UserTable>;
export type UpdateableUserRow = Updateable<UserTable>;
