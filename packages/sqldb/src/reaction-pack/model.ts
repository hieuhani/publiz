import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type ReactionPackType = "SYSTEM" | "DEFAULT" | "PRIVILEGE";

export type ReactionPackTable = {
  id: Generated<number>;
  name: string;
  slug: string;
  type: ReactionPackType;
  description: string;
  organizationId?: number;
  userId: number;
};

export type ReactionPackRow = Selectable<ReactionPackTable>;
export type InsertableReactionPackRow = Insertable<ReactionPackTable>;
export type UpdateableReactionPackRow = Updateable<ReactionPackTable>;
