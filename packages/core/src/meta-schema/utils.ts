import { AppError } from "../error";

const defaultVersion = 1;

export const extractMetaSchemaIdentifier = (identifier: string) => {
  const [name, version] = identifier.split(":");
  if (!version) {
    return {
      name,
      version: defaultVersion,
    };
  }
  const versionNumber = parseInt(version, 10);
  if (isNaN(versionNumber)) {
    throw new AppError(400_003, "Invalid meta schema identifier version");
  }
  return {
    name,
    version: versionNumber,
  };
};
