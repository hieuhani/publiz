import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type FileTable = {
  id: Generated<number>;
  modelName?: string;
  modelId?: number;
  contentType: string;
  fileName: string;
  filePath: string;
  metadata?: any;
};

export type FileRow = Selectable<FileTable>;
export type InsertableFileRow = Insertable<FileTable>;
export type UpdateableFileRow = Updateable<FileTable>;
