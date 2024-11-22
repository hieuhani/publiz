import { type UserRow } from "@publiz/sqldb";

export type User = UserRow;
export type UserRoleBit = number;

export const RoleBanned: UserRoleBit = 0b0000000000000000000000000000000;
export const RoleNormal: UserRoleBit = 0b0000000000000000000000000000001;
export const RoleAdministrator: UserRoleBit = 0b0000000000000000000000001000000;

export const UserRoleAdministrator = RoleNormal | RoleAdministrator;
