import { AppError } from "../error";

export const extractMetaSchemaIdentifier = (identifier: string) => {
  const [name, version] = identifier.split(":");
  const versionNumber = parseInt(version, 10);
  if (isNaN(versionNumber)) {
    throw new AppError(400_003, "Invalid meta schema identifier version");
  }
  return {
    name,
    version: versionNumber,
  };
};
