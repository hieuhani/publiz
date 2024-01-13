import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type UserTable = {
  id: Generated<number>;
  authId: string;
  displayName: string;
  dob?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  gender?: string;
};

export type UserRow = Selectable<UserTable>;
export type InsertableUserRow = Insertable<UserTable>;
export type UpdateableUserRow = Updateable<UserTable>;
