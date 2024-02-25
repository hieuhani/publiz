import {
  GetBucketPolicyStatusCommand,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Container } from "../container";
import { FileModel } from "../file";

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

export const getFileUrl = async (container: Container, file: FileModel) => {
  if (file.contentType.startsWith("image/")) {
    if (file.metadata?.gcsImageServingUrl) {
      const gcsImageServingUrl = file.metadata.gcsImageServingUrl as string;
      return gcsImageServingUrl.includes("?")
        ? `${gcsImageServingUrl}&publiz-file-id=${file.id}`
        : `${gcsImageServingUrl}?publiz-file-id=${file.id}`;
    }
  }

  // TODO: This file URL is only works with bucket that is public
  return `https://storage.googleapis.com/${file.bucket}/${file.filePath}`;
};

export const checkBucketIsPublic = async (
  container: Container,
  bucket: string
) => {
  const command = new GetBucketPolicyStatusCommand({ Bucket: bucket });
  const response = await container.s3.send(command);
  return response.PolicyStatus?.IsPublic === true;
};

type GetGcsImageServingUrlInput = {
  bucket: string;
  key: string;
  endpoint: string;
};
export const getGcsImageServingUrl = async ({
  bucket,
  key,
  endpoint,
}: GetGcsImageServingUrlInput) => {
  try {
    const params = new URLSearchParams({ image: key, bucket });

    const response = await fetch(
      `${endpoint}/get_serving_url?${params.toString()}`
    );
    const { image } = (await response.json()) as { image: string };
    return image;
  } catch (error) {
    console.error(error);
    return null;
  }
};
