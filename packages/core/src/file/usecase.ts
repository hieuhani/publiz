import {
  InsertableFileRow,
  createFileCrudRepository,
  deleteByModelNameAndModelId,
} from "@publiz/sqldb";
import { Container } from "../container";
import { FileModel } from "./model";
import { getFileUrl } from "../s3";

type DeleteModelRelatedFilesInput = {
  modelName: string;
  modelId: string;
};

export const deleteModelRelatedFiles = async (
  container: Container,
  { modelName, modelId }: DeleteModelRelatedFilesInput
) => {
  const result = await deleteByModelNameAndModelId(
    container.sqlDb,
    modelName,
    modelId
  );
  return result.numDeletedRows;
};

type CreateFileInput = InsertableFileRow;

export const createFile = async (
  container: Container,
  input: CreateFileInput
) =>
  withFileUrl(
    container,
    await createFileCrudRepository(container.sqlDb).create(input)
  );

export const getFileById = async (
  container: Container,
  id: number
): Promise<FileModel> => {
  return withFileUrl(
    container,
    await createFileCrudRepository(container.sqlDb).findById(id)
  );
};

const withFileUrl = async (container: Container, file: FileModel) => {
  const fileUrl = await getFileUrl(container, file);
  return { ...file, fileUrl };
};
