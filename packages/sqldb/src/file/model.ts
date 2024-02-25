import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type FileTable = {
  id: Generated<number>;
  contentType: string;
  fileName: string;
  filePath: string;
  bucket: string;
  metadata?: any;
  title?: string;
  description?: string;
  userId: number;
};

export type FileRow = Selectable<FileTable>;
export type InsertableFileRow = Insertable<FileTable>;
export type UpdateableFileRow = Updateable<FileTable>;
