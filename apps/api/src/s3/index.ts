import { S3Client } from "@publiz/core";
import { config } from "../config";

export const getS3Client = () => {
  return new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
    },
  });
};
