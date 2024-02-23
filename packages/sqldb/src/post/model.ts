import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type PostTable = {
  id: Generated<number>;
  title: string;
  excerpt: string;
  content: string;
  contentJson: any;
  parentId?: number;
  authorId: number;
  organizationId?: number;
  type: "REVISION" | "POST";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metadata: any;
};

export type PostRow = Selectable<PostTable>;
export type InsertablePostRow = Insertable<PostTable>;
export type UpdateablePostRow = Updateable<PostTable>;
