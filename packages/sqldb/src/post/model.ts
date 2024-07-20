import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type PostTable = {
  id: Generated<number>;
  publicId: string;
  title: string;
  content: string;
  contentJson: any;
  parentId?: number;
  authorId: number;
  metaSchema?: string;
  organizationId?: number;
  type: "REVISION" | "POST";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metadata: any;
  createdAt?: string;
  updatedAt?: string;
};

export type PostRow = Selectable<PostTable>;
export type InsertablePostRow = Insertable<PostTable>;
export type UpdateablePostRow = Updateable<PostTable>;
