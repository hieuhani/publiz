import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Container } from "../container";

type UploadFileInput = {
  bucket: string;
  key: string;
  body: PutObjectCommandInput["Body"];
  metadata?: Record<string, string>;
};

export const uploadFile = async (
  container: Container,
  { bucket, key, body, metadata }: UploadFileInput
) => {
  await container.s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      Metadata: metadata,
    })
  );
};

type GetPresignedUrlInput = {
  bucket: string;
  key: string;
  expires?: number;
};

export const getPresignedUrl = async (
  container: Container,
  { bucket, key, expires }: GetPresignedUrlInput
) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(container.s3, command, { expiresIn: expires });
};
