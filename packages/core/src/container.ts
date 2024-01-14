import { type SqlDatabase } from "@publiz/sqldb";
import { type S3Client } from "./s3";

export interface Container {
  sqlDb: SqlDatabase;
  s3: S3Client;
}
